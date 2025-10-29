import MyDataTable from "./classes/MyDataTable.ts";
import "./imports.ts";
import "./login.ts";
import * as bootstrap from "bootstrap";
import { getFormData, setFormData } from "./helpers.ts";
import { userSchema } from "./types.ts";
import * as yup from "yup";
import axios from "axios";

/*
	Datable search,order,pagination, export,import buttons
	insert_batch
	javascript async
	sayfa yenilenmeden verilerin güncellenmesi
	bir kullanıcının birden fazla adres tanımlaması
	jquery modern confirm kullan. select2
	login ekranı user create update list delete işlemleri.
	Datatable kullan ajax ile verileri işle post et.
*/

// MAIN DATATABLE
const tableModal = new bootstrap.Modal(document.getElementById("table-modal") as HTMLElement);
const tableModalSubmit = document.getElementById("table-modal-submit") as HTMLElement;
const tableForm = document.getElementById("table-modal-form") as HTMLFormElement;
const tableModalErrors = document.getElementById("table-modal-errors") as HTMLElement;
const tableModalDelete = document.getElementById("table-modal-delete") as HTMLElement;
const tableModalTitle = document.getElementById("table-modal-title") as HTMLElement;

const addressModal = new bootstrap.Modal(document.getElementById("address-modal") as HTMLElement);
const addressModalSubmit = document.getElementById("address-modal-submit") as HTMLElement;
const addressForm = document.getElementById("address-modal-form") as HTMLFormElement;
const addressModalErrors = document.getElementById("address-modal-errors") as HTMLElement;
const addressModalDelete = document.getElementById("address-modal-delete") as HTMLElement;
const addressModalTitle = document.getElementById("address-modal-title") as HTMLElement;

function addressBtn(index?: number) {
	const address = document.createElement("button");
	address.classList.value = "btn btn-outline ms-2";
	address.innerText = "Edit address";

	address.addEventListener("click", () => {
		console.log("address button clicked", index);
		axios.get("/addresses").then((response) => {
			console.log(response.data);
			addressForm.reset();
			addressForm.classList.remove("was-validated");
			addressModalDelete.style.display = "none";
			addressModalErrors.innerHTML = "";
			addressModal.show();
		});
	});
	return address;
}

addressModalSubmit.addEventListener("click", function () {});

addressModalDelete.addEventListener("click", function () {});

axios.defaults.baseURL = "http://localhost/ci3/index.php/api";

const mdt = new MyDataTable("#users-table", {
	ajax(data, callback, settings) {
		axios.get("/users").then((response) => {
			console.log(response.data);
			callback({
				data: response.data,
			});
		});
	},
	scrollCollapse: true,
	scrollY: "500px",
	responsive: true,
	autoFill: true,
	keys: true,
	select: true,

	columns: [
		{ title: "Name", data: "name" },
		{ title: "Position", data: "position" },
		{ title: "Office", data: "office" },
		{ title: "Age", data: "age" },
		{ title: "Start date", data: "start_date" },
		{ title: "Salary", data: "salary" },
		{
			title: "Address",
			data: null,
			orderable: false,
			searchable: false,
			render: (row) => addressBtn(row),
		},
	],

	layout: {
		topStart: {
			buttons: [
				"copy",
				"csv",
				"excel",
				"pdf",
				"print",
				{
					extend: "collection",
					text: "Table control",
					buttons: [
						{
							text: "Toggle start date",
							action: function (e, dt, node, config) {
								dt.column(-2).visible(!dt.column(-2).visible());
							},
						},
						{
							text: "Toggle salary",
							action: function (e, dt, node, config) {
								dt.column(-1).visible(!dt.column(-1).visible());
							},
						},
						{
							popoverTitle: "Visibility control",
							extend: "colvis",
							collectionLayout: "two-column",
						},
					],
				},
				{
					text: "Add new row",
					action: function (e, dt, node, config) {
						tableForm.reset();
						tableForm.classList.remove("was-validated");
						tableModalTitle.innerText = "Add new User";
						mdt.selectedRowIndex = -1;
						tableModalDelete.style.display = "none";
						tableModalSubmit.innerText = "Add User";
						tableModalErrors.innerHTML = "";
						tableModal.show();
					},
				},
				{
					text: "Edit selected row",
					action: async function (e, dt, node, config) {
						const selectedRows = mdt.table.rows({ selected: true });
						const row = selectedRows.count() === 1 ? selectedRows[0] : null;
						if (!row) return;
						tableModalTitle.innerText = "Edit user data";
						tableModalDelete.style.display = "none";
						tableForm.reset();
						const data = mdt.table.row(row).data();
						setFormData(tableForm, data);
						mdt.selectedRowIndex = row[0];
						tableModalDelete.style.display = "inline-block";
						tableModalSubmit.innerText = "Save changes";
						await validateForm();
						tableModal.show();
					},
				},
			],
		},
	},
});

mdt.addNewRow({
	name: "Lachin",
	position: "Developer",
	office: "Baku",
	age: 35,
	start_date: "2020-01-01",
	salary: 3000,
});

async function validateForm() {
	try {
		const user = await userSchema.validate(getFormData(tableForm), { strict: true, abortEarly: false });
		tableForm.classList.add("was-validated");
		tableModalErrors.innerHTML = "";
		tableModalSubmit.removeAttribute("disabled");
	} catch (err) {
		if (err instanceof yup.ValidationError) {
			tableForm.classList.remove("was-validated");
			tableModalErrors.innerHTML = (err as yup.ValidationError).errors.join("<br>");
			tableModalSubmit.setAttribute("disabled", "true");
		}
	}
}

mdt.table.on("dblclick", "tbody tr", async function () {
	const data = mdt.table.row(this).data();
	tableForm.reset();
	setFormData(tableForm, data);
	mdt.selectedRowIndex = mdt.table.row(this).index();
	tableModalDelete.style.display = "inline-block";
	tableModalTitle.innerText = "Edit user data";
	tableModalSubmit.innerText = "Save changes";
	await validateForm();
	tableModal.show();
});

tableForm.addEventListener("input", async () => {
	await validateForm();
});

tableModalSubmit.addEventListener("click", async function () {
	try {
		const user = await userSchema.validate(getFormData(tableForm), { strict: true, abortEarly: false });
		if (mdt.selectedRowIndex === -1) {
			console.log(user);

			axios.post("/users", user).then(() => {
				mdt.addNewRow(user);
				tableModal.hide();
			});
			return;
		}
		axios.put(`/users/${mdt.table.row(mdt.selectedRowIndex as number).data().id}`, user).then((response) => {
			console.log(response);
			mdt.changeSelectedRow(user);
			tableModal.hide();
		});
	} catch (err) {
		console.log(err);
	}
});

tableModalDelete.addEventListener("click", function () {
	axios.delete(`/users/${mdt.table.row(mdt.selectedRowIndex as number).data().id}`).then((response) => {
		tableModal.hide();
		mdt.deleteSelectedRow();
	});
});
