export const BACKEND_SIGNUP_ERRORS = [
	"emailTaken",
	"usernameTaken",
	"weakPassword",
	"invalidInput"
] as const;

export type BackendSignupError = (typeof BACKEND_SIGNUP_ERRORS)[number];

export type SignupError = "" | BackendSignupError | "passwordMismatch" | "generic";
