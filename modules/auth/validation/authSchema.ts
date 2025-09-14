import * as yup from "yup";

export const loginSchema = yup.object().shape({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup.string().required("Password is required"),
});

export const signupSchema = yup.object().shape({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters")
		.matches(/[A-Z]/, "Password must contain an uppercase letter")
		.matches(/[^A-Za-z0-9]/, "Password must contain a symbol")
		.matches(/\d/, "Password must contain a number"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Confirm your password"),
});
