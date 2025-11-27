import { RANodeBinary, RANode  } from './RANode';
import { Schema } from './Schema';
import { Table } from './Table';

export class RecursiveExecutionNode extends RANodeBinary  {
    private _step: Table;
    private _next: Table;

    constructor(name: string, accNode: RANode, stepNode: RANode, next: Table, step: Table) {
        super('union', accNode, stepNode);
        this._step = step
        this._next = next;
        this.setResultNumRows(next.getNumRows());
    }

    getResult(): Table {
        return this._next;
    }

    getStepResult(): Table {
        return this._step;
    }

    getArgumentHtml(): string {
        return `${this._functionName}`;
    }

    getSchema(): Schema {
        return this._next.getSchema();
    }

    check(): void {
        this._child.check();
        this._child2.check();
    }

    public setNumRows(numRows: number): void { this.setResultNumRows(numRows); }
}