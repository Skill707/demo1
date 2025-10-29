import DataTable, { type Api, type Config, type InstSelector } from "datatables.net-bs5";

export default class MyDataTable {
	table: Api<any>;
	selectedRowIndex: number;

	constructor(selector: InstSelector, opts?: Config) {
		this.table = new DataTable(selector, opts);
		this.selectedRowIndex = -1;
	}

	addNewRow(objectData: object) {
		this.table.row.add(objectData).draw(true);
	}

	changeSelectedRow(objectData: object) {
		const row = this.table.row(this.selectedRowIndex as number);
		row.data(objectData).draw();
	}

	deleteSelectedRow() {
		const row = this.table.row(this.selectedRowIndex as number);
		row.remove().draw();
	}
}
