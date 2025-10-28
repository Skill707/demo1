// login ekranı user create update list delete işlemleri.
// Datatable kullan ajax ile verileri işle post et.
// jquery modern confirm kullan. select2 vs. bunlarda olsun.

const tableBody = document.querySelector("#table-body");
const form = document.getElementById("add-user");
const formModal = new bootstrap.Modal(document.getElementById("formModal"));
const addUserBtn = document.getElementById("add-user-btn");
let formFunction = "add"; // or edit NUMBER

addUserBtn.addEventListener("click", () => {
	formModal.show();
	form.reset();
	formFunction = "add";
	document.getElementById("form-modal-title").innerHTML = "Add User";
});

form.addEventListener("input", () => {
	form.classList.add("was-validated");
});

document.getElementById("form-submit").addEventListener("click", () => {
	let error = false;

	if (!form.checkValidity()) {
		console.log("er");
		error = true;
	}

	form.classList.remove("was-validated");

	if (!error) {
		axios.defaults.baseURL = "http://localhost/ci3/index.php/api/users";
		const data = {
			fname: document.getElementById("validationCustomFName").value,
			sname: document.getElementById("validationCustomSName").value,
			email: document.getElementById("validationCustomUsername").value,
			pass: document.getElementById("validationCustomPass").value,
			city: document.getElementById("validationCustomCity").value,
		};

		if (formFunction == "add") {
			axios.post("", data).then(() => {
				addRowToTable(data);
				form.reset();
				formModal.hide();
			});
		} else {
			axios.put(`${formFunction}`, data).then((response) => {
				console.log(response);
				formModal.hide();
				form.reset();
			});
		}
	}
});

function addRowToTable(element) {
	const tr = document.createElement("tr");
	tr.innerHTML = `
            <td>${element.fname}</th>
            <td>${element.sname}</td>
            <td>${element.email}</td>
            <td>${element.city}</td>
        `;
	const tdHandle = document.createElement("td");

	const removeBtn = document.createElement("button");
	removeBtn.classList.value = "btn btn-outline-danger";
	removeBtn.innerText = "Remove";
	tdHandle.appendChild(removeBtn);
	removeBtn.addEventListener("click", () => {
		$.confirm({
			title: "What is up?",
			content: "Here goes a little content",
			type: "green",
			buttons: {
				ok: {
					text: "ok!",
					btnClass: "btn-primary",
					keys: ["enter"],
					action: function () {
						axios.defaults.baseURL = "http://localhost/ci3/index.php/api/users";
						axios.delete(`${element.id}`).then((response) => {
							tr.remove();
						});
					},
				},
				cancel: function () {},
			},
		});
	});

	const editBtn = document.createElement("button");
	editBtn.classList.value = "btn btn-outline-primary ms-2";
	editBtn.innerText = "Edit";

	editBtn.addEventListener("click", () => {
		axios.defaults.baseURL = "http://localhost/ci3/index.php/api/users";
		axios.get(`${element.id}`).then((response) => {
			console.log(response.data);
			const data = response.data;
			document.getElementById("validationCustomFName").value = data.fname;
			document.getElementById("validationCustomSName").value = data.sname;
			document.getElementById("validationCustomUsername").value = data.email;
			document.getElementById("validationCustomPass").value = data.pass;
			document.getElementById("validationCustomCity").value = data.city;
			document.getElementById("form-modal-title").innerHTML = "Edit User";
			formFunction = element.id;
			formModal.show();
		});
	});

	tdHandle.appendChild(editBtn);

	tr.appendChild(tdHandle);
	tableBody.appendChild(tr);
}

axios.defaults.baseURL = "http://localhost/ci3/index.php/api/users";
axios.get().then((response) => {
	const data = response.data;

	data.forEach((element) => {
		addRowToTable(element);
	});
});

axios.defaults.baseURL = "https://countriesnow.space/api/v0.1/countries/";
const formSelect = document.querySelector(".form-select");
axios.get().then((response) => {
	const data = response.data;

	let text = "";
	data.data
		.filter((element) => element.country === "Turkey" || element.country === "Azerbaijan")
		.forEach((element) => {
			text += ` <optgroup label="${element.country}">`;

			element.cities.forEach((city) => {
				text += `<option value="${city}">${city}</option>`;
			});

			text += `</optgroup>`;
		});
	formSelect.innerHTML += text;
});

$(document).ready(function () {
	$(".form-select").select2({
		theme: "bootstrap-5",
	});
});
