type AuthTypes = "google"|"vk"

interface AuthUser {
    profile_id: string,
    access_token: string,
    refresh_token: string,
    type: AuthTypes
};

export default AuthUser;