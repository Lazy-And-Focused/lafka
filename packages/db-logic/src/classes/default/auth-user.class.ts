import type { AuthTypes, AuthUser as AuthUserType } from "lafka/types/auth/auth-user.types";
import type { User } from "lafka/types/authors/user.types";

import Database from "database/models.database";
import { ModelData } from "lafka/types/schema/mongodb.types";

const { auth_users: AuthUsers } = Database;

class AuthUser implements AuthUserType {
	private readonly _id: string;
	private readonly _profile_id: string;
	private readonly _service_id: string;
	private readonly _access_token: string;
	private readonly _refresh_token?: string;
	private readonly _type: AuthTypes;
	private readonly _created_at: Date;

	public constructor(data: ModelData<Omit<AuthUserType, "created_at">> & { profile_id?: string }) {
		this._id = "";
		this._profile_id = data.profile_id || "null";
		this._service_id = data.service_id;
		this._created_at = new Date();

		this._access_token = data.access_token;
		this._refresh_token = data.refresh_token;
		this._type = data.type;
	}

	public async init() {
		if (this._profile_id !== "null") {
			const user = (
				await Database.auth_users.getData({
					filter: {
						profile_id: this._profile_id,
						type: this._type
					}
				})
			).data;

			if (user && user[0] && user.length === 1) {
				user[0].access_token = this._access_token;
				user[0].refresh_token = this._refresh_token;
				await user[0].save();

				return this;
			} else if (user && user.length > 1) {
				for (const u of user) {
					u.deleteOne();
				}
			}
		}

		const user = (
			await Database.auth_users.getData({
				filter: { service_id: this._service_id, type: this._type }
			})
		).data;

		if (user && user[0]) {
			await AuthUsers.update({
				filter: { service_id: this._service_id, type: this._type },
				update: {
					service_id: this._service_id,
					access_token: this._access_token,
					refresh_token: this._refresh_token
				}
			});

			return this;
		} else {
			await AuthUsers.create({
				service_id: this._service_id,
				created_at: this._created_at,
				access_token: this._access_token,
				refresh_token: this._refresh_token,
				profile_id: this._profile_id,
				type: this._type
			});

			return this;
		}
	}

	public async updateProfileId(id: string): Promise<User | null> {
		const user = await AuthUsers.model.findOne({ id: id || this._id });

		if (!user) return null;

		user.profile_id = id;
		await user.save();

		return ((await Database.users.getData({ filter: { _id: id } })).data as any)[0];
	}

	public get id(): string {
		return this._id;
	}

	public get profile_id(): string {
		return this._profile_id;
	}

	public get service_id(): string {
		return this._service_id;
	}

	public get created_at(): Date {
		return this._created_at;
	}

	public get access_token(): string {
		return this._access_token;
	}

	public get refresh_token(): string | undefined {
		return this._refresh_token;
	}

	public get type(): AuthTypes {
		return this._type;
	}
}

export default AuthUser;
