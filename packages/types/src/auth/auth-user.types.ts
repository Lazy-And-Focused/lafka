export type AuthTypes = "google" | "vk";

interface AuthUser {
	id: string;
	profile_id: string;
	service_id: string;
	access_token: string;
	refresh_token?: string;
	type: AuthTypes;
}

export { AuthUser };
