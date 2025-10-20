/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { EditorBase, getColumnNamesFromRaRoot, getHintsFromGroup } from 'calc2/components/editorBase';
import { Result } from 'calc2/components/result';
import { Item } from 'calc2/components/toolbar';
import { t, T } from 'calc2/i18n';
import { Group } from 'calc2/store/groups';
import { deserializeFromParsedObj } from 'calc2/utils/worker-serde/deserializer';
import * as CodeMirror from 'codemirror';
import { Relation } from 'db/exec/Relation';
import dbExecClasses from 'db/exec/classes';
import { AutoreplaceOperatorsMode, parseRelalg, queryWithReplacedOperatorsFromAst, relalgFromRelalgAstRoot, replaceVariables } from 'db/relalg';
import * as React from 'react';
import { faCalendarAlt, faTable, faMagic, faPaste } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
// worker import
// @ts-ignore 
import editorRelalgWorker from './editorRelalg.worker';
import { getSerializeValueWithClassName } from '../utils/worker-serde/serializer';

type WorkerProcessResp = { success: null, error: string | Error } | {
	success: {
		ast: ReturnType<typeof parseRelalg>,
		root: ReturnType<typeof relalgFromRelalgAstRoot>
	}, error: null
}

const QUERY_EXEC_TIMEOUT_MS = 15_000;

function getInitialQueryExecTimeout() {
	const queryTimeoutStr = localStorage.getItem('queryTimeout')
	return queryTimeoutStr ? Number(queryTimeoutStr) : QUERY_EXEC_TIMEOUT_MS
}

/**
 * class to abstract the communication between our main thread and the
 * editorRelalgWorker, this exposes the available operations at it
 * in a async behavior, to offload our main thread.
 */
class EditorRelalgWorker {
	resolveById: Record<string, [(resp: any) => void, (err: Error) => void]> = {}
	cachedRelationsByGroupName: Record<string, { [name: string]: Relation }> = {}
	worker: Worker;
	constructor(worker: Worker) {
		this.worker = worker;
		this.setupHandlers();
	}

	setupHandlers() {
		this.worker.onmessage = this._onMessage.bind(this);
		this.worker.onerror = console.log;
	}

	reinitializeWorker() {
		const oldWorker = this.worker;
		const worker = editorRelalgWorker();
		if (oldWorker) {
			oldWorker.postMessage({ type: 'terminated' });
			oldWorker.onmessage = null;
			oldWorker.onerror = null;
			try { oldWorker.terminate(); } catch (err) { console.error(err); }
		}
		this.worker = worker;
		this.setupHandlers();
		const cacheRelations = function () {
			for (const [groupName, relations] of Object.entries(this.cachedRelationsByGroupName)) {
				this.cacheRelations(groupName, relations, true);
			}
		}.bind(this);
		setTimeout(cacheRelations, 0);
	}

	_onMessage(response: MessageEvent<{ id: string } & (WorkerProcessResp)>) {
		const { id, ...resp } = response.data
		const [resolveFn, rejectFn] = this.resolveById[id];
		if (resolveFn) {
			if (resp.success) {
				resp.success.root = deserializeFromParsedObj(resp.success.root as any, dbExecClasses, {});
				resolveFn(resp.success);
			} else {
				if (typeof resp.error === "string") {
					rejectFn(new Error(t(resp.error as any)))
				} else {
					rejectFn(resp.error)
				}
			}
			delete this.resolveById[id]
		}
	}

	cacheRelations(groupName: string, relations: { [name: string]: Relation }, force = false) {
		if (this.cachedRelationsByGroupName[groupName] && !force) {
			return
		}
		this.worker.postMessage({
			type: "cacheRelations",
			payload: {
				groupName,
				relations: getSerializeValueWithClassName(relations)
			}
		});
		this.cachedRelationsByGroupName[groupName] = relations;
	}

	async exec(text: string, groupName: string, withResult: boolean, timeoutMs: number | undefined) {
		const id = window.crypto.randomUUID();
		const resolveById = this.resolveById;
		const execPromise = new Promise<{
			ast: ReturnType<typeof parseRelalg>,
			root: ReturnType<typeof relalgFromRelalgAstRoot>,
			result: ReturnType<ReturnType<typeof relalgFromRelalgAstRoot>['getResult']> | null
		}>((resolve, reject) => {
			resolveById[id] = [resolve, reject];
			this.worker.postMessage({
				type: "exec",
				payload: { text, groupName, id, withResult }
			});
		});
		const timeout = withResult && timeoutMs ? setTimeout(() => {
			this.reinitializeWorker();
			if (resolveById[id]) {
				const [_, reject] = resolveById[id];
				reject(new Error(t('calc.messages.error-query-execution-timeout', { execTimeout: (timeoutMs / 1000).toLocaleString(undefined, { style: 'unit', unit: 'second', unitDisplay: 'narrow' }) })));
			}
		}, timeoutMs) : undefined;
		return execPromise.then((response) => {
			clearTimeout(timeout);
			return response;
		});
	}
}

const EDITOR_RELALG_WORKER = new EditorRelalgWorker(editorRelalgWorker() as any)

const NUM_TREE_LABEL_COLORS = 6;
export const KEYWORDS_RELALG = [
	'pi', 'sigma', 'rho', 'tau', '<-', 'intersect', 'union', '/', '-', '\\', 'x', 'cross join', 'join',
	'inner join', 'natural join', 'left join', 'right join', 'left outer join',
	'right outer join', 'full outer join', 'left semi join', 'right semi join', 'anti join',
	'and', 'or', 'xor', '||',
];

type Props = {
	group: Group,
	relInsertModalToggle: Function,
};
type State = {
	autoreplaceOperatorsMode: AutoreplaceOperatorsMode,
	relations: { [name: string]: Relation },
	groupName: string
};

export class EditorRelalg extends React.Component<Props, State> {
	private editorBase: EditorBase | null = null;
	constructor(props: Props) {
		super(props);
		this.state = {
			autoreplaceOperatorsMode: 'none',
			relations: props.group.tables.reduce((acc, table) => {
				acc[table.tableName] = table.relation
				return acc
			}, {} as { [name: string]: Relation }),
			groupName: props.group.groupName.fallback
		};
		EDITOR_RELALG_WORKER.cacheRelations(this.state.groupName, this.state.relations);
		this.replaceText = this.replaceText.bind(this);
	}

	static getDerivedStateFromProps(nextProps: Props, prevState: State): State | null {
		if (prevState.groupName === nextProps.group.groupName.fallback) {
			return null;
		} else {
			const updatedState = {
				...prevState,
				relations: nextProps.group.tables.reduce((acc, table) => {
					acc[table.tableName] = table.relation
					return acc
				}, {} as { [name: string]: Relation }),
				groupName: nextProps.group.groupName.fallback
			}
			EDITOR_RELALG_WORKER.cacheRelations(updatedState.groupName, updatedState.relations);
			return updatedState
		}
	}

	render() {
		const { group } = this.props;
		const { autoreplaceOperatorsMode } = this.state;

		return (
			<EditorBase
				editQueryTimeout
				queryTimeout={getInitialQueryExecTimeout()}
				onQueryTimeoutChange={(queryTimeout) => {
					if (queryTimeout != undefined) {
						localStorage.setItem('queryTimeout', queryTimeout.toString());
					}
				}}
				exampleRA={group.exampleRA}
				exampleBags={group.exampleBags}
				exampleSql={group.exampleSQL}
				textChange={(cm: CodeMirror.Editor) => { }}
				ref={ref => {
					if (ref) {
						this.editorBase = ref;
					}
				}}
				mode="relalg"
				execFunction={async (self: EditorBase, text: string, offset) => {
					self.historyAddEntry(text);
					self.clearExecutionAlerts();
					let ast: ReturnType<typeof parseRelalg>;
					let root: ReturnType<typeof relalgFromRelalgAstRoot>;
					if (EDITOR_RELALG_WORKER.worker) {
						const resp = await EDITOR_RELALG_WORKER.exec(text, this.state.groupName, true, this.editorBase?.getQueryTimeout());
						ast = resp.ast
						root = resp.root
					} else {
						ast = parseRelalg(text, Object.keys(this.state.relations));
						replaceVariables(ast, this.state.relations);

						if (ast.child === null) {
							if (ast.assignments.length > 0) {
								throw new Error(t('calc.messages.error-query-missing-assignments-found'));
							}
							else {
								throw new Error(t('calc.messages.error-query-missing'));
							}
						}


						root = relalgFromRelalgAstRoot(ast, this.state.relations);
						root.check();
					}

					if (self.props.enableInlineRelationEditor) {
						self.addInlineRelationMarkers(ast);
					}

					// calc.displayRaResult(root);
					return {
						result: (
							<Result
								editorRef={this.editorBase!}
								root={root}
								numTreeLabelColors={NUM_TREE_LABEL_COLORS}
								execTime={root._resTime || root._execTime || 0}
								doEliminateDuplicates={true}
							/>
						),
					};
				}}
				tab="relalg"
				linterFunction={async (self: EditorBase, editor: CodeMirror.Editor, text: string) => {
					const hints: string[] = [];

					if (EDITOR_RELALG_WORKER.worker) {
						const resp = await EDITOR_RELALG_WORKER.exec(text, this.state.groupName, false, this.editorBase?.getQueryTimeout());
						const ast = resp.ast;
						for (let i = 0; i < ast.assignments.length; i++) {
							hints.push(ast.assignments[i].name);
						}
						if (editor.getDoc().somethingSelected() === false) {
							const cursorOld: { line: number, ch: number } = editor.getDoc().getCursor();
							const { query, cursor } = queryWithReplacedOperatorsFromAst(text, ast.operatorPositions, { line: cursorOld.line + 1, column: cursorOld.ch + 1 }, autoreplaceOperatorsMode);
							if (query !== text) {
								editor.setValue(query);
								editor.getDoc().setCursor({ line: cursor.line - 1, ch: cursor.column - 1 });
							}
						}


						if (self.props.enableInlineRelationEditor) {
							self.addInlineRelationMarkers(ast);
						}
					} else {
						const ast = parseRelalg(text, Object.keys(this.state.relations));
						replaceVariables(ast, this.state.relations);

						for (let i = 0; i < ast.assignments.length; i++) {
							hints.push(ast.assignments[i].name);
						}

						if (ast.child === null) {
							if (ast.assignments.length > 0) {
								throw new Error(t('calc.messages.error-query-missing-assignments-found'));
							}
							else {
								throw new Error(t('calc.messages.error-query-missing'));
							}
						}


						const root = relalgFromRelalgAstRoot(ast, this.state.relations);
						root.check();

						// replace text (text-magic)
						if (editor.getDoc().somethingSelected() === false) {
							const cursorOld: { line: number, ch: number } = editor.getDoc().getCursor();
							const { query, cursor } = queryWithReplacedOperatorsFromAst(text, ast.operatorPositions, { line: cursorOld.line + 1, column: cursorOld.ch + 1 }, autoreplaceOperatorsMode);
							if (query !== text) {
								editor.setValue(query);
								editor.getDoc().setCursor({ line: cursor.line - 1, ch: cursor.column - 1 });
							}
						}


						if (self.props.enableInlineRelationEditor) {
							self.addInlineRelationMarkers(ast);
						}
						hints.push(...getColumnNamesFromRaRoot(root));
					}

					// use columns from all calculated schemas for hints
					return hints;
				}}
				getHintsFunction={() => {
					const hints: string[] = [
						...KEYWORDS_RELALG,

						// add table and column names
						...getHintsFromGroup(group),
					];
					return hints;
				}}
				enableInlineRelationEditor={true}
				toolbar={[
					{
						math: true,
						items: [
							{
								label: 'π',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.projection',
								tooltip: 'calc.editors.ra.toolbar.projection-content',
							},
							{
								label: 'σ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.selection',
								tooltip: 'calc.editors.ra.toolbar.selection-content',
							},
							{
								label: 'ρ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.rename',
								tooltip: 'calc.editors.ra.toolbar.rename-content',
							},
							{
								label: '←',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.rename-columns-operator',
								tooltip: 'calc.editors.ra.toolbar.rename-columns-operator-content',
							},
							{
								label: '→',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.right-arrow',
								tooltip: 'calc.editors.ra.toolbar.right-arrow-content',
							},
							{
								label: 'τ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.orderBy',
								tooltip: 'calc.editors.ra.toolbar.orderBy-content',
							},
							{
								label: 'γ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.groupBy',
								tooltip: 'calc.editors.ra.toolbar.groupBy-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '∧',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.and',
								tooltip: 'calc.editors.ra.toolbar.and-content',
							},
							{
								label: '∨',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.or',
								tooltip: 'calc.editors.ra.toolbar.or-content',
							},
							{
								label: '¬',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.not',
								tooltip: 'calc.editors.ra.toolbar.not-content',
							},

							{
								label: '=',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.equals',
								tooltip: 'calc.editors.ra.toolbar.equals-content',
							},
							{
								label: '≠',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.not-equals',
								tooltip: 'calc.editors.ra.toolbar.not-equals-content',
							},
							{
								label: '≥',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.greater-or-equals',
								tooltip: 'calc.editors.ra.toolbar.greater-or-equals-content',
							},
							{
								label: '≤',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.lesser-or-equals',
								tooltip: 'calc.editors.ra.toolbar.lesser-or-equals-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '∩',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.intersect',
								tooltip: 'calc.editors.ra.toolbar.intersect-content',
							},
							{
								label: '∪',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.union',
								tooltip: 'calc.editors.ra.toolbar.union-content',
							},
							{
								label: '÷',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.division',
								tooltip: 'calc.editors.ra.toolbar.division-content',
							},
							{
								label: '-',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.subtraction',
								tooltip: 'calc.editors.ra.toolbar.subtraction-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '⨯',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.cross-join',
								tooltip: 'calc.editors.ra.toolbar.cross-join-content',
							},
							{
								label: '⨝',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.natural-join',
								tooltip: 'calc.editors.ra.toolbar.natural-join-content',
							},
							{
								label: '⟕',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.left-outer-join',
								tooltip: 'calc.editors.ra.toolbar.left-outer-join-content',
							},
							{
								label: '⟖',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.right-outer-join',
								tooltip: 'calc.editors.ra.toolbar.right-outer-join-content',
							},
							{
								label: '⟗',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.full-outer-join',
								tooltip: 'calc.editors.ra.toolbar.full-outer-join-content',
							},
							{
								label: '⋉',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.left-semi-join',
								tooltip: 'calc.editors.ra.toolbar.left-semi-join-content',
							},
							{
								label: '⋊',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.right-semi-join',
								tooltip: 'calc.editors.ra.toolbar.right-semi-join-content',
							},
							{
								label: '▷',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.anti-join',
								tooltip: 'calc.editors.ra.toolbar.anti-join-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '=',
								onClick: item => this.replaceText(item, '= '),
								tooltipTitle: 'calc.editors.ra.toolbar.assignment',
								tooltip: 'calc.editors.ra.toolbar.assignment-content',
							},
							{
								label: '--',
								onClick: item => this.replaceText(item, '-- '),
								tooltipTitle: 'calc.editors.ra.toolbar.single-line-comment',
								tooltip: 'calc.editors.ra.toolbar.single-line-comment-content',
							},
							{
								label: '/*',
								onClick: item => this.replaceText(item, '/*  */'),
								tooltipTitle: 'calc.editors.ra.toolbar.multi-line-comment',
								tooltip: 'calc.editors.ra.toolbar.multi-line-comment-content',
							},
							{
								label: '{}',
								onClick: item => this.replaceText(item, '{a:string, b:number, X.c:date\n\ta, 1, 1970-01-01\n}'),
								tooltipTitle: 'calc.editors.ra.toolbar.inline-relation',
								tooltip: 'calc.editors.ra.toolbar.inline-relation-content',
							},
						],
					},
					{
						items: [
							{
								label: <FontAwesomeIcon icon={faTable as IconProp} />,
								onClick: () => {
									if (this.editorBase) {
										this.editorBase.inlineRelationEditorOpen(null);
									}
								},
								tooltipTitle: 'calc.editors.ra.toolbar.inline-relation-editor',
								tooltip: 'calc.editors.ra.toolbar.inline-relation-editor-content',
							},
							{
								label: <FontAwesomeIcon icon={faCalendarAlt as IconProp} />,
								onClick: item => this.replaceText(item, `date('1970-01-01')`),
								tooltipTitle: 'calc.editors.ra.toolbar.insert-date',
								tooltip: 'calc.editors.ra.toolbar.insert-date-content',
							},
							{
								className: 'showOnSM',
								label: <FontAwesomeIcon className="editorButtonOnSM" icon={faPaste as IconProp} />,
								onClick: () => { this.props.relInsertModalToggle(); },
								tooltipTitle: 'calc.editors.insert-relation-title',
								tooltip: 'calc.editors.insert-relation-tooltip',
							},
						],
					},
					{
						items: [
							{
								className: 'dropdownToolbarButton',
								type: 'dropdown',
								label: <FontAwesomeIcon className="editorButtonOnSM" icon={faMagic as IconProp} />,
								tooltipTitle: 'calc.editors.ra.toolbar.autoreplace-operators.title',
								tooltip: 'calc.editors.ra.toolbar.autoreplace-operators.header',
								elements: [
									{
										type: 'header',
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.header" />,
									},
									{
										type: 'separator',
									},
									{
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.none" />,
										value: 'none',
									},
									{
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.plain2math" />,
										value: 'plain2math',
									},
									{
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.math2plain" />,
										value: 'math2plain',
									},
								],
								value: autoreplaceOperatorsMode,
								onChange: (value: string) => {
									this.setState({
										autoreplaceOperatorsMode: value as AutoreplaceOperatorsMode,
									}, () => {
										if (this.editorBase) {
											this.editorBase.forceLinterRun();
										}
									});
								},
							},
						],
					},
				]}
			/>
		);
	}

	private replaceText(item: Item, overwrite?: string) {
		if (this.editorBase) {
			this.editorBase.replaceText(item, overwrite);
		}
	}

	public replaceSelection(text: string, overwrite?: string) {
		if (this.editorBase) {
			this.editorBase.replaceSelection(text, overwrite);
		}
	}
}
