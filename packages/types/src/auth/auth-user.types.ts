export const authTypes = ["google", "yandex"] as const;

export type AuthTypes = (typeof authTypes)[number];

interface AuthUser {
	id: string;
	profile_id: string;
	service_id: string;
	access_token: string;
	refresh_token?: string;
	created_at: Date;
	type: AuthTypes;
}

export { AuthUser };
