import * as bootstrap from "bootstrap";
import { MyForm } from "./classes/MyForm";
import { loginSchema } from "./types";

const loginModal = new bootstrap.Modal(document.getElementById("login-modal") as HTMLElement);
const login = document.getElementById("login-button") as HTMLButtonElement;

const form = new MyForm(
	document.getElementById("login-modal-body") as HTMLElement,
	{
		username: "Username",
		password: "Password",
	},
	{
		id: "",
		username: "",
		password: "",
	},
	loginSchema,
	"admins",
	"",
	true
);
form.onAdd = (val) => {
	if (val.username) {
		loginModal.hide();
		login.innerText = val.username;
	} else {
		login.innerText = "Login";
	}
};

login.addEventListener("click", () => {
	loginModal.show();
});
