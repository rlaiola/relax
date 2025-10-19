import { RANode, Session } from './RANode';
import { Table } from './Table';
import { Schema } from './Schema';

export class RecursiveRef extends RANode {
    private _name: string;
    private _cachedSchema?: Schema;

    constructor(name: string) {
        super('recursiveRef');
        this._name = name;
    }

    public setCachedSchema(schema: Schema) {
        this._cachedSchema = schema;
    }

    getSchema(): Schema {
        if (this._cachedSchema) return this._cachedSchema;
        throw new Error(`Schema ainda não disponível para referência recursiva '${this._name}'.`);
    }

    check(): void {
        // Nada: validação feita no nó pai
    }

    getResult(_dedup: boolean = true, session?: Session): Table {
        session = this._returnOrCreateSession(session);
        const t = session._recursiveVars?.[this._name];
        if (!t) {
            throw new Error(`Referência recursiva '${this._name}' usada antes de inicialização.`);
        }
        // atualizar num linhas
        this.setResultNumRows(t.getNumRows());
        return t;
    }

    getWarnings(): any[] { return []; }

    getArgumentHtml(): string { return this._name; }

    getFormulaHtml(): string {
        return `<span class="math">ref(${this._name})</span>`;
    }
}