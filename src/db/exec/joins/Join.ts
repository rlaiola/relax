/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { CodeInfo } from '../CodeInfo';
import { ExecutionError } from '../ExecutionError';
import { RANode, RANodeBinary, Session } from '../RANode';
import { Data, Schema } from '../Schema';
import { Table } from '../Table';
import * as ValueExpr from '../ValueExpr';
import { bool } from 'prop-types';
import Handsontable from "handsontable";
//import Date = Handsontable._editors.Date;


export type JoinCondition = {
	type: 'theta',
	joinExpression: ValueExpr.ValueExpr,
} | {
	type: 'natural',
	restrictToColumns: string[] | null,
};

/**
 * relational algebra Join operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition condition is either a ValueExpr evaluating to boolean
 *                                         or an Array of unqualified column names as strings for the using clause or
 *                                         null for a natural join
 * @param   {String}               joinType  joinType is either inner, left or right
 * @returns {Join}
 */
export abstract class Join extends RANodeBinary {
	_joinConditionOptions: JoinCondition;
	_joinConditionBooleanExpr: ValueExpr.ValueExpr | null = null;
	_joinConditionEvaluator: null | ((rowA: Data[], rowB: Data[], rowNumberA: number, session: Session) => boolean) = null;
	_isRightJoin: boolean;
	_isAntiJoin: boolean;
	_schema: Schema | null = null;
	_rowCreatorMatched: null | ((rowA: Data[], rowB: Data[]) => Data[]) = null;
	_rowCreatorNotMatched: null | ((rowA: Data[], rowB: Data[]) => Data[]) = null; // used for outer joins
	_executionStart: any;
	_executedEnd: any;

	constructor(
		child: RANode,
		child2: RANode,
		functionName: string,
		/** condition is either a ValueExpr evaluating to boolean
		 * or an Array of unqualified column names as strings for the using clause or
		 * null for a natural join 
		 */
		joinCondition: JoinCondition,
		isRightJoin: boolean,
		isAntiJoin = false,
	) {
		super(functionName, child, child2);
		this._isAntiJoin = isAntiJoin;
		this._isRightJoin = isRightJoin;
		this._joinConditionOptions = joinCondition;
	}

	getSchema() {
		if (this._schema === null) {
			throw new Error(`check not called`);
		}

		return this._schema;
	}

	/**
	 * sets the _joinConditionEvaluator based on the _joinCondition options
	 */
	check() {
		this._child.check();
		this._child2.check();
		const schemaA = this._child.getSchema();
		const schemaB = this._child2.getSchema();

		if (this._joinConditionOptions.type === 'natural') {
			const { restrictToColumns } = this._joinConditionOptions;

			// check if columns of using clause appear in both schemas
			if (restrictToColumns !== null) {
				for (let i = 0; i < restrictToColumns.length; i++) {
					if (schemaA.getColumnIndexArray(restrictToColumns[i], null).length === 0 || schemaB.getColumnIndexArray(restrictToColumns[i], null).length === 0) {
						this.throwExecutionError(i18n.t('db.messages.exec.error-column-not-in-both-schemas', { column: restrictToColumns[i] }));
					}
				}
			}

			// generate natural condition
			this._joinConditionBooleanExpr = Join.getNaturalJoinCondition(schemaA, schemaB, restrictToColumns);
			this.setMetaData('naturalJoinConditions', Join.getNaturalJoinConditionArray(schemaA, schemaB, restrictToColumns));
		}
		else {
			// theta joins
			this._joinConditionBooleanExpr = this._joinConditionOptions.joinExpression;
		}

		try {
			this._joinConditionBooleanExpr.check(schemaA, schemaB);
		}
		catch (e) {
			// Second try: check whether predicate uses relation alias(es)

			// Get schemas
			const schemas = [schemaA, schemaB];

			// Get relation aliases and split into variables arrays
			const relAliases: string[] = [
				this._child.getMetaData('fromVariable') ?? '',
				this._child2.getMetaData('fromVariable') ?? ''
			];
			const vars: string[][] = relAliases.map(v => v ? v.split(/\s+/) : []);

			// Precompute column meta for each schema to avoid repeated calls
			type ColMeta = { name: string, relAlias: string, altAlias: string, idx: number };
			const allColsMeta: ColMeta[][] = [[], []];
			const numCols = [schemaA.getSize(), schemaB.getSize()];

			for (let i = 0; i < 2; i++) {
				const schema = schemas[i];
				const n = numCols[i];
				let varIndex = 0;
				// get initial relAlias if any (safe fallback)
				let lastRelAlias = n > 0 ? (schema.getColumn(0).getRelAlias() ?? '') : '';
				for (let j = 0; j < n; j++) {
					const col = schema.getColumn(j);
					const name = String(col.getName());
					const relAlias = String(col.getRelAlias() ?? '');
					// advance alt alias index when relAlias changes (same logic as original)
					if (relAlias !== lastRelAlias) {
						lastRelAlias = relAlias;
						if (varIndex < vars[i].length - 1) varIndex++;
					}
					const altAlias = vars[i][varIndex] ?? '';
					allColsMeta[i].push({ name, relAlias, altAlias, idx: j });
				}
			}

			// Build blacklist: names that appear more than once in same schema
			const blacklist: Set<string>[] = [new Set(), new Set()];
			for (let i = 0; i < 2; i++) {
				const freq: Record<string, number> = Object.create(null);
				for (const col of allColsMeta[i]) {
					freq[col.name] = (freq[col.name] || 0) + 1;
				}
				for (const [name, cnt] of Object.entries(freq)) {
					if (cnt > 1) blacklist[i].add(name);
				}
			}

			// Helper: iterate masks from 1 .. (1<<n)-1
			const maxMasks = [
				numCols[0] > 0 ? (1 << numCols[0]) : 0,
				numCols[1] > 0 ? (1 << numCols[1]) : 0
			];

			let schemaWorked = false;

			// Try every non-empty subset mask for schemaA
			for (let maskA = 1; maskA < maxMasks[0] && !schemaWorked; maskA++) {
				// copy schemaA once per mask
				const newSchemaA = schemaA.copy();
				let failedA = false;

				// apply aliases for bits set in maskA
				for (let b = 0; b < numCols[0]; b++) {
					if ((maskA & (1 << b)) === 0) continue;
					const meta = allColsMeta[0][b];
					if (blacklist[0].has(meta.name)) { failedA = true; break; }

					// Validate that the current relAlias matches expected (safety check)
					const currentRelAlias = newSchemaA.getColumn(meta.idx).getRelAlias() ?? '';
					if (currentRelAlias !== meta.relAlias) { failedA = true; break; }

					try {
						// set alt alias
						newSchemaA.setRelAlias(String(meta.altAlias), meta.idx);
					} catch (err) {
						failedA = true;
						break;
					}
				}

				if (failedA) continue;

				// Try every non-empty subset mask for schemaB
				for (let maskB = 1; maskB < maxMasks[1] && !schemaWorked; maskB++) {
					const newSchemaB = schemaB.copy();
					let failedB = false;

					for (let b = 0; b < numCols[1]; b++) {
						if ((maskB & (1 << b)) === 0) continue;
						const meta = allColsMeta[1][b];
						if (blacklist[1].has(meta.name)) { failedB = true; break; }

						const currentRelAlias = newSchemaB.getColumn(meta.idx).getRelAlias() ?? '';
						if (currentRelAlias !== meta.relAlias) { failedB = true; break; }

						try {
							newSchemaB.setRelAlias(String(meta.altAlias), meta.idx);
						} catch (err) {
							failedB = true;
							break;
						}
					}

					if (failedB) continue;

					// Test the condition with the candidate schemas
					try {
						this._joinConditionBooleanExpr.check(newSchemaA, newSchemaB);
						schemaWorked = true;
						break; // found a working combination
					} catch (err) {
						// test failed — try next maskB
						continue;
					}
				}
			}

			if (!schemaWorked) {
				this.throwExecutionError(e.message);
			}
		}

		if (this._joinConditionBooleanExpr.getDataType() !== 'boolean') {
			throw new ExecutionError('db.messages.exec.error-condition-must-be-boolean', this._codeInfo);
		}

		const expr = this._joinConditionBooleanExpr;
		this._joinConditionEvaluator = (rowA: Data[], rowB: Data[], rowNumber: number, session): boolean => {
			// the boolean expression evaluation returns either true,false or 'unknown'!
			return expr.evaluate(rowA, rowB, rowNumber, session) === true;
		};

		// the schema specific part of the check process
		this._checkSchema(schemaA, schemaB);
	}

	/**
	 * sets the _schema, and the _rowCreatorMatched, _rowCreatorNotMatched
	 * based on the type of the join
	 */
	protected abstract _checkSchema(schemaA: Schema, schemaB: Schema): void;


	_getResult(doEliminateDuplicateRows: boolean = true, session: Session | undefined) {
		session = this._returnOrCreateSession(session);

		

		if (this._joinConditionEvaluator === null) {
			throw new Error(`check not called`);
		}

		const resultTable = new Table();
		resultTable.setSchema(this.getSchema());
		this._executionStart = Date.now();

		Join.calcNestedLoopJoin(
			doEliminateDuplicateRows,
			session,
			this.getChild(),
			this.getChild2(),
			resultTable,
			this._isRightJoin,
			this._isAntiJoin,
			this._joinConditionEvaluator,
			this._rowCreatorMatched,
			this._rowCreatorNotMatched,
		);

		// can be omitted if join is known to produce no new duplicates (e.g semi join) 
		if (doEliminateDuplicateRows === true) {
			resultTable.eliminateDuplicateRows();
		}

		this.setResultNumRows(resultTable.getNumRows());

		// If it is a semi join on bag/multiset mode
		if ((this._functionName === '⋉' || this._functionName === '⋊') &&
			doEliminateDuplicateRows !== true) {
			const newResultTable = new Table();
			newResultTable.setSchema(this.getSchema());
			const orgA = this._isRightJoin ?
				this.getChild2().getResult(doEliminateDuplicateRows, session) :
				this.getChild().getResult(doEliminateDuplicateRows, session);
			const orgB = resultTable;
			const numRowsA = orgA.getNumRows();
			const numRowsB = orgB.getNumRows();
			const numCols = orgA.getNumCols();
			for (let i = 0; i < numRowsA; i++) {
				const rowA = orgA.getRow(i);
				for (let j = 0; j < numRowsB; j++) {
					const rowB = orgB.getRow(j);
					let equals = true;

					for (let k = 0; k < numCols; k++) {
						if (rowA[k] !== rowB[k]) {
							equals = false;
							break;
						}
					}
	
					if (equals) {
						newResultTable.addRow(rowA);
						break;
					}
				}
			}

			this.setResultNumRows(newResultTable.getNumRows());
			this._executedEnd = Date.now() - this._executionStart;
			return newResultTable;
		}
		else {
			// Regular path
			this._executedEnd = Date.now() - this._executionStart;
			return resultTable;
		}
	}


	static createNullArray(size: number): null[] {
		return new Array(size).fill(null);
	}

	static createNaturalRowArray = function (rowA: any[], rowB: any[], newRowSize: number, keepIndicesA: number[], keepIndicesB: number[]) {
		const row = new Array(newRowSize);
		let col = 0;
		for (let k = 0; k < keepIndicesA.length; k++) {
			row[col++] = rowA[keepIndicesA[k]];
		}
		for (let k = 0; k < keepIndicesB.length; k++) {
			row[col++] = rowB[keepIndicesB[k]];
		}
		return row;
	};

	/**
	 * returns an function to evaluate the given boolean expression
	 */
	static getCheckedEvaluatorBooleanExpression(schemaA: Schema, schemaB: Schema, expr: ValueExpr.ValueExpr, codeInfo: CodeInfo) {
		expr.check(schemaA, schemaB);
		if (expr.getDataType() !== 'boolean') {
			throw new ExecutionError('db.messages.exec.error-condition-must-be-boolean', codeInfo);
		}

		return function (rowA: Data[], rowB: Data[], rowNumber: number, session: Session): boolean {
			// the boolean expression evaluation returns either true,false or 'unknown'!
			return expr.evaluate(rowA, rowB, rowNumber, session) === true;
		};
	}

	static getCheckedEvaluatorNaturalJoin(schemaA: Schema, schemaB: Schema, expr: ValueExpr.ValueExpr, codeInfo: CodeInfo) {

	}

	static calcNestedLoopJoin(
		doEliminateDuplicateRows: boolean,
		session: Session,
		childA: RANode,
		childB: RANode,
		targetTable: Table,
		isRightJoin: boolean,
		isAntiJoin: boolean,
		evalJoinCondition: (rowA: Data[], rowB: Data[], rowNumberA: number, session: Session) => boolean,
		createRowToAddIfMatched: null | ((rowA: Data[], rowB: Data[]) => Data[]),
		createRowToAddIfNOTMatched: null | ((rowA: Data[], rowB: Data[]) => Data[]),
	): void {

		const orgA = childA.getResult(doEliminateDuplicateRows, session);
		const orgB = childB.getResult(doEliminateDuplicateRows, session);
		const numRowsA = orgA.getNumRows();
		const numRowsB = orgB.getNumRows();
		const numColsA = orgA.getNumCols();
		const numColsB = orgB.getNumCols();

		if (isRightJoin === false) { // left (outer) joins
			let nullArrayRight: null[];
			if (createRowToAddIfNOTMatched !== null) {
				nullArrayRight = Join.createNullArray(targetTable.getSchema().getSize() - numColsA); // == size of new A
			}
			const antiJoinDict: { [index: number]: boolean } = {};
			for (let i = 0; i < numRowsA; i++) {
				const rowA = orgA.getRow(i);
				let match = false;
				if (isAntiJoin) {
					antiJoinDict[i] = false;
				}
				for (let j = 0; j < numRowsB; j++) {
					const rowB = orgB.getRow(j);
					if (evalJoinCondition(rowA, rowB, i, session) !== true) {
						continue;
					}
					else {
						// add row
						match = true;
						if (createRowToAddIfMatched !== null) {
							const row = createRowToAddIfMatched(rowA, rowB);
							if (isAntiJoin) {
								antiJoinDict[i] = false;
							} else {
								targetTable.addRow(row);
							}
						}
					}
				}
				if (match === false && createRowToAddIfNOTMatched !== null) {
					const row = createRowToAddIfNOTMatched(rowA, nullArrayRight!);
					if (row === null) {
						continue;
					}
					if (isAntiJoin) {
						antiJoinDict[i] = true;
					} else {
						targetTable.addRow(row);
					}
				}
			}
			if (isAntiJoin) {
				for (let i = 0; i < numRowsA; i++) {
					if (antiJoinDict[i] === true) {
						targetTable.addRow(orgA.getRow(i));
					}
				}
			}
		}
		else { // right (outer) joins
			let nullArrayLeft: null[];
			if (createRowToAddIfNOTMatched !== null) {
				nullArrayLeft = Join.createNullArray(targetTable.getSchema().getSize() - numColsB); // == size of new B
			}

			for (let i = 0; i < numRowsB; i++) {
				const rowB = orgB.getRow(i);
				let match = false;

				for (let j = 0; j < numRowsA; j++) {
					const rowA = orgA.getRow(j);

					if (evalJoinCondition(rowA, rowB, i, session) !== true) {
						continue;
					}
					else {
						// add row
						match = true;
						if (createRowToAddIfMatched !== null) {
							const row = createRowToAddIfMatched(rowA, rowB);
							targetTable.addRow(row);
						}
					}
				}

				if (match === false && createRowToAddIfNOTMatched !== null) {
					const row = createRowToAddIfNOTMatched(nullArrayLeft!, rowB);
					if (row === null) {
						continue;
					}
					targetTable.addRow(row);
				}
			}
		}
	}

	getArgumentHtml(): string {
		if (this._joinConditionBooleanExpr === null) {
			throw new Error(`check not called`);
		}

		if (this._joinConditionOptions.type === 'natural') {
			return '';
		}
		else {
			return this._joinConditionBooleanExpr.getFormulaHtml();
		}
	}

	static checkForDuplicates(schema: Schema): boolean {
		const cols: { [name: string]: boolean; } = {};
		for (let i = 0; i < schema.getSize(); i++) {
			const name = schema.getColumn(i).getName();
			if (name in cols) {
				return true;
			}
			cols[name] = true;
		}
		return false;
	}

	static getNaturalJoinConditionArray(schemaA: Schema, schemaB: Schema, restrictToColumns: string[] | null = null) {
		const numColsA = schemaA.getSize();
		const conditions: ValueExpr.ValueExpr[] = [];
		const hasDuplicateCols = Join.checkForDuplicates(schemaA) || Join.checkForDuplicates(schemaB);
		

		// find columns with the same name in schemaA and schemaB
		for (let i = 0; i < numColsA; i++) {
			const a = schemaA.getColumn(i);
			if (restrictToColumns !== null && restrictToColumns.indexOf(a.getName() + '') === -1) {
				// skip all but certain columns (for joins with USING())
				continue;
			}
			
			let indices = [];
			if (hasDuplicateCols) {
				indices = schemaB.getColumnIndexArray(a.getName(), a.getRelAlias());
			} else {
				indices = schemaB.getColumnIndexArray(a.getName(), null);
			}

			for (let j = 0; j < indices.length; j++) {
				const index = indices[j];

				const b = schemaB.getColumn(index);

				// the column indices are set manually
				const equals = new ValueExpr.ValueExprGeneric('boolean', '=', [
					new ValueExpr.ValueExprColumnValue(a.getName(), a.getRelAlias(), i),
					new ValueExpr.ValueExprColumnValue(b.getName(), b.getRelAlias(), numColsA + index),
				]);
				conditions.push(equals);
			}
		}
		return conditions;
	}

	static getNaturalJoinCondition(schemaA: Schema, schemaB: Schema, restrictToColumns: string[] | null = null): ValueExpr.ValueExpr {
		const conditions = Join.getNaturalJoinConditionArray(schemaA, schemaB, restrictToColumns);
		const length = conditions.length;
		switch (length) {
			case 0:
				return new ValueExpr.ValueExprGeneric('boolean', 'constant', [true]);

			case 1:
				return conditions[0];

			default:
				let cond = new ValueExpr.ValueExprGeneric('boolean', 'and', [conditions[0], conditions[1]]);
				for (let i = 2; i < length; i++) {
					cond = new ValueExpr.ValueExprGeneric('boolean', 'and', [cond, conditions[i]]);
				}
				return cond;
		}
	}
}
