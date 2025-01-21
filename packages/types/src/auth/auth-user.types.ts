export type AuthTypes = "google"|"vk"

interface AuthUser {
    _id: string;
    profile_id: string,
    access_token: string,
    refresh_token: string,
    type: AuthTypes
};

export { AuthUser };