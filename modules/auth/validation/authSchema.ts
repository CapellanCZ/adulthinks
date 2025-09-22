import * as yup from "yup";

// Custom validation methods
yup.addMethod(yup.string, 'strongPassword', function(message = 'Password is not strong enough') {
  return this.test('strong-password', message, function(value) {
    if (!value) return true; // Let required() handle empty values
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);	
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
    const isLongEnough = value.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
  });
});

export const loginSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.email("Please enter a valid email address")
		.required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(1, "Password cannot be empty"),
});

export const signupSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.email("Please enter a valid email address")
		.required("Email is required")
		.max(254, "Email is too long"),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters")
		.max(128, "Password is too long")
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(/[a-z]/, "Password must contain at least one lowercase letter")
		.matches(/\d/, "Password must contain at least one number")
		.matches(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
	confirmPassword: yup
		.string()
		.required("Please confirm your password")
		.oneOf([yup.ref("password")], "Passwords do not match"),
});
