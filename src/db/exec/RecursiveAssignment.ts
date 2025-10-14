import { RANode, Session } from './RANode';
import { Table } from './Table';
import { RecursiveRef } from './RecursiveRef';
import { Schema } from './Schema';

export class RecursiveAssignment extends RANode {
    private _name: string;
    private _initial: RANode;
    private _recursive: RANode;
    private _cachedSchema: any;

    constructor(name: string, initial: RANode, recursive: RANode) {
        super('recursive');
        this._name = name;
        this._initial = initial;
        this._recursive = recursive;
    }

    private _schemasUnionCompatible(a: Schema, b: Schema): { ok: boolean; reason?: string } {
        if (a.getSize() !== b.getSize()) {
          return { ok: false, reason: `número de colunas difere (${a.getSize()} vs ${b.getSize()})` };
        }
        for (let i = 0; i < a.getSize(); i++) {
          const ca = a.getColumn(i);
          const cb = b.getColumn(i);
          const ta = a.getType(i);
          const tb = b.getType(i);

          if (ca.getName() !== cb.getName()) {
            return { ok: false, reason: `coluna ${i + 1} tem nomes diferentes (${ca.getName()} vs ${cb.getName()})` };
          }
          if (ta !== tb) {
            return { ok: false, reason: `coluna ${i + 1} tem tipos diferentes (${ta} vs ${tb})` };
          }
        }
        return { ok: true };
      }

    private _propagateSchemaToRefs(schema: any) {
         // clona se possível
        const clone = (typeof schema.copy === 'function') ? schema.copy() : schema;
        // força alias = nome da variável recursiva (ex.: "path")
        if (clone && Array.isArray((clone as any)._relAliases)) {
            (clone as any)._relAliases = (clone as any)._relAliases.map(() => this._name);
        }

        const visit = (n: RANode) => {
            if (!n) return;
            if (n instanceof RecursiveRef && (n as any)._name === this._name) {
            n.setCachedSchema(clone);
            }
            const anyN: any = n as any;
            if (anyN._child) visit(anyN._child);
            if (anyN._child2) visit(anyN._child2);
            if (Array.isArray(anyN._children)) {
            for (const c of anyN._children) visit(c);
            }
        };
        visit(this._recursive);
    }

    getSchema() {
        if (!this._cachedSchema) {
            this._cachedSchema = this._initial.getSchema();
            this._propagateSchemaToRefs(this._cachedSchema);
        }
        return this._cachedSchema;
    }

    check() {
        // Valida o nó inicial e obtém o esquema
        this._initial.check();
        const initialSchema = this._initial.getSchema();

        // Propaga o esquema inicial para os nós recursivos
        this._propagateSchemaToRefs(initialSchema);

        // Valida o nó recursivo
        this._recursive.check();
        const recursiveSchema = this._recursive.getSchema();

        // 4) checa compatibilidade para união
        const compat = this._schemasUnionCompatible(initialSchema, recursiveSchema);
        if (!compat.ok) {
            this.throwExecutionError(`recursive ${this._name}: seed e passo recursivo não são compatíveis para union: ${compat.reason}`);
        }
    }

    private unionTables(a: Table, b: Table, dedup: boolean): Table {
        const res = a.copy();
        for (let i = 0; i < b.getNumRows(); i++) {
            res.addRow(b.getRow(i));
        }
        if (dedup) {
            res.eliminateDuplicateRows();
        }
        return res;
    }

    getResult(doEliminateDuplicateRows: boolean = true, session?: Session): Table {
        session = this._returnOrCreateSession(session);

        let acc = this._initial.getResult(doEliminateDuplicateRows, session);

        if (!session._recursiveVars) session._recursiveVars = {};
        session._recursiveVars[this._name] = acc;

        for (let i = 0; i < 1024; i++) {
            const step = this._recursive.getResult(doEliminateDuplicateRows, session);

            // Guarda de segurança
            const compat = this._schemasUnionCompatible(acc.getSchema(), step.getSchema());
            if (!compat.ok) {
            this.throwExecutionError(`recursive ${this._name}: union incompatível em execução: ${compat.reason}`);
            }

            const next = this.unionTables(acc, step, doEliminateDuplicateRows);
            if (next.equals(acc)) {
                acc = next;
                break;
            }
            acc = next;
            session._recursiveVars[this._name] = acc;
        }

        this.setResultNumRows(acc.getNumRows());
        console.log(acc)
        return acc;

    }

    getArgumentHtml() { return this._name; }

    getWarnings(): any[] { return []; }

    getFormulaHtml(): string {
        return `<span class="math">recursive ${this._name}</span>`;
    }
}