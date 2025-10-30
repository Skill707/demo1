import axios from "axios";
import type { AddressFormData, endpoint, LoginFormData, UserFormData } from "../types";
import * as yup from "yup";

axios.defaults.baseURL = "http://localhost/ci3/index.php/api";

export class MyForm {
	dom: HTMLElement;
	form: HTMLFormElement;
	validationShema: yup.ObjectSchema<any>;
	errors_label: HTMLLabelElement;
	save_button: HTMLButtonElement;
	onAdd: (val: any) => void = () => 0;
	onChange: (val: any) => void = () => 0;
	onDelete: () => void = () => 0;

	constructor(
		dom: HTMLElement,
		fields: AddressFormData | UserFormData | LoginFormData,
		data: AddressFormData | UserFormData | LoginFormData,
		validationShema: yup.ObjectSchema<any>,
		endpoint: endpoint,
		title: string = "",
		noDelete = false
	) {
		this.validationShema = validationShema;
		this.dom = dom;
		this.form = document.createElement("form");
		this.form.id = "table-modal-form";
		this.form.classList.value = "row g-3 needs-validation";
		this.form.noValidate = true;

		if (title !== "") {
			const titleHeader = document.createElement("h5");
			titleHeader.innerText = title;
			this.form.appendChild(titleHeader);
		}

		for (const [key, value] of Object.entries(fields)) {
			const div = document.createElement("div");
			div.classList.value = "col-md-4";
			const label = document.createElement("label");
			label.classList.value = "form-label";
			label.innerText = value;
			const input = document.createElement("input");
			input.classList.value = "form-control";
			input.name = key;
			input.value = (data as any)[key];
			div.appendChild(label);
			div.appendChild(input);
			this.form.appendChild(div);
		}

		const div = document.createElement("div");
		div.classList.value = "col-md-12 d-flex justify-content-end";
		this.errors_label = document.createElement("label");
		this.errors_label.classList.value = "form-label text-danger";
		this.save_button = document.createElement("button");
		this.save_button.classList.value = "btn btn-primary";
		this.save_button.innerText = "Save";
		this.save_button.setAttribute("disabled", "true");

		this.save_button.addEventListener("click", async (e) => {
			e.preventDefault();
			console.log("save button clicked", `/${endpoint}/${data.id}`);

			try {
				const val = await this.validationShema.validate(this.getFormData(this.form), { strict: true, abortEarly: false });
				console.log(val);
				if (data.id) {
					console.log("put");

					axios.put(`/${endpoint}/${data.id}`, val).then((response) => {
						console.log("updated", response.data);
						this.save_button.setAttribute("disabled", "true");
						val.id = data.id;
						this.onChange(val);
					});
				} else {
					console.log("post");
					axios.post(`/${endpoint}`, val).then((response) => {
						console.log("created", response.data);
						this.save_button.setAttribute("disabled", "true");
						if (response.data.id) val.id = response.data.id.toString();
						this.onAdd(val);
					});
				}
			} catch (error) {
				console.log(error);
			}
		});

		div.appendChild(this.errors_label);
		div.appendChild(this.save_button);

		if (!noDelete) {
			const delete_button = document.createElement("button");
			delete_button.classList.value = "btn btn-danger ms-2";
			delete_button.innerText = "Delete";

			delete_button.addEventListener("click", (e) => {
				e.preventDefault();
				console.log("delete button clicked", `/${endpoint}/${data.id}`);
				axios.delete(`/${endpoint}/${data.id}`).then((response) => {
					console.log("deleted", response.data);
					this.dom.removeChild(this.form);
					this.onDelete();
				});
			});
			div.appendChild(delete_button);
		}

		this.form.appendChild(div);

		this.dom.appendChild(this.form);

		this.form.addEventListener("input", async () => {
			await this.validateForm();
		});
	}

	async validateForm() {
		try {
			const data = this.getFormData(this.form);
			await this.validationShema.validate(data, { strict: true, abortEarly: false });
			this.form.classList.add("was-validated");
			this.errors_label.innerHTML = "";
			this.save_button.removeAttribute("disabled");
		} catch (err) {
			if (err instanceof yup.ValidationError) {
				this.form.classList.remove("was-validated");
				this.errors_label.innerHTML = (err as yup.ValidationError).errors.join("<br>");
				this.save_button.setAttribute("disabled", "true");
			}
		}
	}

	getFormData(tableForm: HTMLFormElement) {
		const rowColms: string[] = Array.from(tableForm.querySelectorAll("[name]").values()).map((input) => {
			return input.getAttribute("name") as string;
		});

		const formData = {};
		rowColms.forEach((colName) => {
			const input = tableForm.querySelector(`[name="${colName}"]`) as HTMLInputElement;
			const inputType = input.type;
			let value: any;
			if (inputType === "number") {
				value = input.value ? Number(input.value) : null;
			} else {
				value = input.value;
			}
			Object.assign(formData, { [colName]: value });
		});
		return formData;
	}
}
