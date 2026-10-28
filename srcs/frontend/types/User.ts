// a user's own fields (BackendUser in lib/backend.ts)
export type Role = "admin" | "user";

export type SortKey = "date" | "username" | "email";

/** Why saving a user failed: a key of Users.errors in messages/*.json */
export type UserError = "invalid" | "notAllowed" | "notFound" | "emailTaken" | "workspace" | "generic";

/** The UserError for a backend answer's HTTP status */
export function userError(status: number): UserError {
	if (status === 400 || status === 422)
		return "invalid";
	if (status === 401 || status === 403)
		return "notAllowed";
	if (status === 404)
		return "notFound";
	if (status === 409)
		return "emailTaken";
	return "generic";
}

export type UpdateUserState = {
	ok: boolean;
	error?: UserError;
} | null;

/** Why changing the password failed: a key of Profile.password.errors in messages/*.json */
export type PasswordError = "wrongCurrent" | "same" | "mismatch" | "invalid" | "notAllowed" | "generic";

export type ChangePasswordState = {
	ok: boolean;
	error?: PasswordError;
} | null;
