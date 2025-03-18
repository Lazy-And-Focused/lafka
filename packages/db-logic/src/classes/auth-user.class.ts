import { LAFka } from "lafka/types";

import Database, { Constructors } from "database/models.database";
import { CreateData } from "lafka/types/mongodb.types";

class AuthUser implements LAFka.AuthUser {
	private _data: LAFka.AuthUser;
	private readonly _filter_options: {
		profile: {
			profile_id: string,
			type: LAFka.AuthTypes
		},
		service: {
			service_id: string,
			type: LAFka.AuthTypes
		}
	};
	private readonly _tokens: {
		access_token: string
		refresh_token?: string
	};
	
	private readonly _database: Database = new Database();

	public constructor(data: Constructors.auth_users) {
		this._data = {
			id: "",
			created_at: new Date(),
			...data,
		}

		this._tokens = {
			access_token: data.access_token,
			refresh_token: data.refresh_token
		};

		this._filter_options = {
			profile: {
				profile_id: data.profile_id || "null",
				type: data.type
			},
			service: {
				service_id: data.profile_id || "null",
				type: data.type
			}
		};
	}

	public async init() {
		const userData = this._data;

		if (userData.profile_id !== "null") {
			const { data } = (
				await this._database.auth_users.getData({
					filter: this._filter_options.profile
				})
			);

			if (data && data[0] && data.length === 1) {
				await this._database.auth_users.update({
					filter: data[0],
					update: this._tokens
				});

				return this.paste(this._data, data[0]);
			} else if (data && data.length > 1) {
				for (const u of data) {
					this._database.auth_users.delete({id: u.id})
				}
			}
		}

		const { data } = (
			await this._database.auth_users.getData({
				filter: this._filter_options.service
			})
		);

		if (data && data[0]) {
			await this._database.auth_users.update({
				filter: this._filter_options.service,
				update: {
					service_id: userData.service_id,
					...this._tokens
				}
			});

			return this.paste(this._data, data[0]);
		} else {
			const created = await this._database.auth_users.create({...userData});

			return this.paste(this._data, created);
		}
	}

	private readonly paste = (data: CreateData<LAFka.AuthUser>, user: LAFka.AuthUser) => {
		this._data = {
			...data,
			...user,

			id: user.id
		};

		return this;
	};
	
	public async updateProfileId(id: string): Promise<LAFka.User | null> {
		await this._database.auth_users.update({
			filter: { id: this._data.id },
			update: { profile_id: id }
		});

		this._data.profile_id = id;

		const { data } = await this._database.users.getData({filter: { id: this.profile_id }})

		return data	
			? data[0]
			: null;
	}

	public get id(): string {
		return this._data.id;
	}

	public get profile_id(): string {
		return this._data.profile_id;
	}

	public get service_id(): string {
		return this._data.service_id;
	}

	public get created_at(): Date {
		return this._data.created_at;
	}

	public get access_token(): string {
		return this._data.access_token;
	}

	public get refresh_token(): string | undefined {
		return this._data.refresh_token;
	}

	public get type(): LAFka.AuthTypes {
		return this._data.type;
	}
}

export default AuthUser;
