import MyDataTable from "./classes/MyDataTable.ts";
import "./imports.ts";
import "./login.ts";
import * as bootstrap from "bootstrap";
import { addressSchema, userSchema, type AddressFormData } from "./types.ts";
import axios from "axios";
import { MyForm } from "./classes/MyForm.ts";

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

axios.defaults.baseURL = "http://localhost/ci3/index.php/api";

// MAIN DATATABLE
const tableModal = new bootstrap.Modal(document.getElementById("table-modal") as HTMLElement);
const tableModalBody = document.getElementById("table-modal-body") as HTMLBodyElement;
const tableModalTitle = document.getElementById("table-modal-title") as HTMLElement;

const userFormFields = {
	name: "Name",
	position: "Position",
	office: "Office",
	age: "Age",
	start_date: "Start date",
	salary: "Salary",
};

const addressModal = new bootstrap.Modal(document.getElementById("address-modal") as HTMLElement);
const addressModalAdd = document.getElementById("address-modal-add") as HTMLElement;
const addressModalBody = document.getElementById("address-modal-body") as HTMLBodyElement;
const addressModalTitle = document.getElementById("address-modal-title") as HTMLElement;
let addressModalUserId: number = -1;

const addressFormFields = {
	street: "Street",
	city: "City",
	country: "Country",
	is_primary: "Is primary",
	postal_code: "Postal code",
};

function addressBtn(user_id: number, user_name: string) {
	const address = document.createElement("button");
	address.classList.value = "btn btn-outline ms-2";
	address.innerText = "Edit addresses";

	address.addEventListener("click", () => {
		axios.get("/addresses/user/" + user_id).then((response) => {
			addressModalUserId = user_id;
			addressModalBody.innerHTML = "";
			addressModalTitle.innerText = "Addresses of: " + user_name;
			const addresses: AddressFormData[] = response.data;
			addresses.forEach((addres) => {
				new MyForm(addressModalBody, addressFormFields, addres, addressSchema, "addresses", "Address id: " + addres.id);
			});
			addressModal.show();
		});
	});
	return address;
}

const mdt = new MyDataTable("#users-table", {
	ajax(data, callback, settings) {
		axios.get("/users").then((response) => {
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
		{ title: "ID", data: "id" },
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
			render: (row) => addressBtn(row.id, row.name),
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
						tableModalTitle.innerText = "Add new User";
						mdt.selectedRowIndex = -1;
						tableModalBody.innerHTML = "";
						const addUserForm = new MyForm(
							tableModalBody,
							userFormFields,
							{
								id: "",
								name: "",
								position: "",
								office: "",
								age: "",
								start_date: "",
								salary: "",
							},
							userSchema,
							"users",
							"",
							true
						);
						addUserForm.onAdd = (val: any) => {
							console.log(val);
							mdt.addNewRow(val);
							tableModal.hide();
						};
						tableModal.show();
					},
				},
				{
					text: "Edit selected row",
					action: async function (e, dt, node, config) {
						const selectedRows = mdt.table.rows({ selected: true });
						const row = selectedRows.count() === 1 ? selectedRows[0] : null;
						if (!row) return;
						const data = mdt.table.row(row).data();
						mdt.selectedRowIndex = row[0];
						openUserEditModal(data);
					},
				},
			],
		},
	},
});

mdt.table.on("dblclick", "tbody tr", async function () {
	const data = mdt.table.row(this).data();
	mdt.selectedRowIndex = mdt.table.row(this).index();
	openUserEditModal(data);
});

function openUserEditModal(data: any) {
	tableModalBody.innerHTML = "";
	tableModalTitle.innerText = "Edit user data";
	const editUserForm = new MyForm(tableModalBody, userFormFields, data, userSchema, "users");
	editUserForm.onChange = (val: any) => {
		mdt.changeSelectedRow(val);
		tableModal.hide();
	};
	editUserForm.onDelete = () => {
		mdt.deleteSelectedRow();
		tableModal.hide();
	};
	tableModal.show();
}

/*
tableModalSubmit.addEventListener("click", async function () {
	try {
		const data = mdt.table.row(mdt.selectedRowIndex as number).data();
		console.log(data);
		const user = await userSchema.validate(data, { strict: true, abortEarly: false });
		console.log(user);
		if (mdt.selectedRowIndex === -1) {
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

*/

addressModalAdd.addEventListener("click", function () {
	const data: AddressFormData = {
		id: "",
		user_id: addressModalUserId.toString(),
		street: "",
		city: "",
		country: "",
		is_primary: "",
		postal_code: "",
	};

	axios.post("/addresses", data).then((response) => {
		console.log("axios post addresses", response.data);
		data.id = response.data.id.toString();
		console.log(data);
		new MyForm(addressModalBody, addressFormFields, data, addressSchema, "addresses", "Address id: " + data.id);
	});
});
