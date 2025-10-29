import * as yup from "yup";

export const userSchema = yup.object({
	name: yup.string().min(3).required(),
	position: yup.string().required(),
	office: yup.string().required(),
	age: yup.number().min(18).required(),
	//start_date: yup.date().required(),
	salary: yup.number().min(1000).required(),
});

export type User = yup.InferType<typeof userSchema>;
