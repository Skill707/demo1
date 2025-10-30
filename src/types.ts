import * as yup from "yup";

export const userSchema = yup.object({
	id: yup.string(),
	name: yup.string().min(3).required(),
	position: yup.string().required(),
	office: yup.string().required(),
	age: yup.string().min(2).required(),
	start_date: yup.string().required(),
	salary: yup.string().min(2).required(),
});

export type UserFormData = yup.InferType<typeof userSchema>;

export const addressSchema = yup.object({
	id: yup.string(),
	user_id: yup.string(),
	street: yup.string().min(3).required(),
	city: yup.string().min(3).required(),
	country: yup.string().min(3).required(),
	is_primary: yup.string().min(1).required(),
	postal_code: yup.string().min(3).max(5).required(),
});

export type AddressFormData = yup.InferType<typeof addressSchema>;

export const loginSchema = yup.object({
	id: yup.string(),
	username: yup.string().required(),
	password: yup.string().required(),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

export type endpoint = "users" | "addresses" | "admins";

