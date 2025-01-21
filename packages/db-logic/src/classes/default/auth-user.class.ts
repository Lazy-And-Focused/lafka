import type { AuthTypes, AuthUser as AuthUserType } from "types/auth/auth-user.types";
import type { User } from "types/authors/user.types";

import Database from "database/models.database";

const { auth_users: AuthUsers } = Database;

class AuthUser implements AuthUserType {
    private readonly _id_: string;
    private readonly _profile_id: string;
    private readonly _access_token: string;
    private readonly _refresh_token: string;
    private readonly _type: AuthTypes;

    public constructor(data: AuthUserType & { profile_id?: string }) {
        this._profile_id = data.profile_id || "";

        this._id_ = data._id;
        this._access_token = data.access_token;
        this._refresh_token = data.refresh_token;
        this._type = data.type;
    }

    public async init() {
        const user = await AuthUsers.model.findById(this._id_);

        if (user) {
            await AuthUsers.update({
                filter: { _id: this._id_ },
                update: {
                    access_token: this._access_token,
                    refresh_token: this._refresh_token
                }
            });

            return this;
        } else {
            await AuthUsers.create({
                access_token: this._access_token,
                refresh_token: this._refresh_token,
                profile_id: this._profile_id,
                type: this._type
            });

            return this;
        }
    }
    
    public async updateProfileId(id: string): Promise<User|null> {
        const user = await AuthUsers.model.findById(this._id_);

        if (!user) return null;

        user.profile_id = id;
        await user.save();

        return ((await Database.users.getData({filter: { _id: id }})).data as any)[0];
    }

    public get _id(): string {
        return this._id_;
    }

    public get profile_id(): string {
        return this._profile_id;
    };
    
    public get access_token(): string {
        return this._access_token;
    };
    
    public get refresh_token(): string {
        return this._refresh_token;
    };
    
    public get type(): AuthTypes {
        return this._type;
    };
}

export default AuthUser;