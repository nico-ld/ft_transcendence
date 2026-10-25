export type LoginError =
	| ""
	| "invalidCredentials"
	| "generic"
	| "oauthCancelled"
	| "oauthExpired"
	| "oauthUnavailable"
	| "oauthConflict";

// ?error= codes from the backend (FtLoginError in routers/oauth42.py), keep in sync
const OAUTH_ERRORS = {
	oauth_cancelled: "oauthCancelled",
	oauth_expired: "oauthExpired",
	oauth_unavailable: "oauthUnavailable",
	oauth_conflict: "oauthConflict"
} as const satisfies Record<string, LoginError>;

export function oauthLoginError(code: unknown): LoginError {
	// hasOwn, not `in`: "toString" and co. exist on every object
	if (typeof code === "string" && Object.hasOwn(OAUTH_ERRORS, code))
		return OAUTH_ERRORS[code as keyof typeof OAUTH_ERRORS];
	return "";
}
