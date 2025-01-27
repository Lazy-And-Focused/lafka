export const authTypes = ["google", "vkontakte"] as const;

export type AuthTypes = (typeof authTypes)[number];

interface AuthUser {
	id: string;
	profile_id: string;
	service_id: string;
	access_token: string;
	refresh_token?: string;
	type: AuthTypes;
}

export { AuthUser };
