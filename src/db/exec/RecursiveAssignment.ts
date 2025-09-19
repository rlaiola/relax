import { RANode, Session } from './RANode';
import { Table } from './Table';

export class RecursiveAssignment extends RANode {
    private _initial: RANode;
    private _recursive: RANode;

    constructor(initial: RANode, recursive: RANode) {
        super('recursive');
        this._initial = initial;
        this._recursive = recursive;
    }

    getSchema() {
        return this._initial.getSchema();
    }

    getResult(doEliminateDuplicateRows: boolean = true, session?: Session): Table {
        let prev = this._initial.getResult(doEliminateDuplicateRows, session);
        while (true) {
            const next = this._recursive.getResult(doEliminateDuplicateRows, session);
            if (next.equals(prev)) break;
            prev = next;
        }
        this.setResultNumRows(prev.getNumRows());
        return prev;
    }

    check() {
        this._initial.check();
        this._recursive.check();
    }

    getArgumentHtml() {
        return '';
    }

    getWarnings(recursive: boolean): any[] {
        return [];
    }

    getFormulaHtml(printChildren: boolean, isChildElement: boolean): string {
        return `<span class="math">recursive</span>`;
    }
}