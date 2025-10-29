export function getFormData(tableForm: HTMLFormElement) {
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

export function setFormData(tableForm: HTMLFormElement, data: any) {
	const rowColms = Array.from(tableForm.querySelectorAll("[name]").values());
	rowColms.forEach((input: Element) => {
		const colName = input.getAttribute("name") as string;
		const value = data[colName];
		(input as HTMLInputElement).value = value;
	});
}
