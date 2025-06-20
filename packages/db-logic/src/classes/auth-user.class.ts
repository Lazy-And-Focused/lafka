import Database, { Constructors } from "database/models.database";

import { LAFka } from "lafka/types";

import { CreateData } from "lafka/types/mongodb.types";
import { Helpers } from "./helpers";

class AuthUser implements LAFka.AuthUser {
  private readonly filter_options: {
    profile: {
      profile_id: string;
      type: LAFka.AuthTypes;
    };
    service: {
      service_id: string;
      type: LAFka.AuthTypes;
    };
  };

  private readonly tokens: {
    access_token: string;
    refresh_token?: string;
  };

  private readonly database = new Database();
  private data: LAFka.AuthUser;

  public constructor(data: Constructors.auth_users) {
    this.data = {
      id: "",
      created_at: new Date().toISOString(),
      ...data
    };

    this.tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token
    };

    this.filter_options = {
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
    const authUserData = this.data;

    if (authUserData.profile_id !== "null") {
      const { data } = await this.database.auth_users.getData({
        filter: this.filter_options.profile
      });

      if (data && data[0] && data.length === 1) {
        await this.database.auth_users.update({
          filter: data[0],
          update: this.tokens
        });

        return this.paste(this.data, data[0]);
      } else if (data && data.length > 1) {
        for (const u of data) {
          this.database.auth_users.delete({ id: u.id });
        }
      }
    }

    const { data: gettedAuthUser } = await this.database.auth_users.getData({
      filter: this.filter_options.service
    });

    if (gettedAuthUser && gettedAuthUser[0]) {
      await this.database.auth_users.update({
        filter: this.filter_options.service,
        update: {
          service_id: authUserData.service_id,
          ...this.tokens
        }
      });

      return this.paste(this.data, gettedAuthUser[0]);
    } else {
      const createdAuthUser = await this.database.auth_users.create({ ...authUserData });

      return this.paste(this.data, createdAuthUser);
    }
  }

  public static async delete(userId: string) {
    const db = new Database();
    const auth_user = await db.auth_users.delete({ profile_id: userId });
    const user = await db.users.delete({ id: userId });

    return { auth_user, user };
  }

  public async delete(userId?: string) {
    return AuthUser.delete(userId || this.data.profile_id);
  }

  public async updateProfileId(id: string): Promise<LAFka.User | null> {
    await this.database.auth_users.update({
      filter: { id: this.data.id },
      update: { profile_id: id }
    });

    this.data.profile_id = id;

    const { data } = await this.database.users.getData({ filter: { id: this.profile_id } });

    return data ? data[0] : null;
  }

  public get id(): string {
    return this.data.id;
  }

  public get profile_id(): string {
    return this.data.profile_id;
  }

  public get service_id(): string {
    return this.data.service_id;
  }

  public get created_at(): string {
    return this.data.created_at;
  }

  public get access_token(): string {
    return this.data.access_token;
  }

  public get refresh_token(): string | undefined {
    return this.data.refresh_token;
  }

  public get type(): LAFka.AuthTypes {
    return this.data.type;
  }

  private readonly paste = (data: CreateData<LAFka.AuthUser>, user: LAFka.AuthUser) => {
    this.data = Helpers.parse<LAFka.AuthUser>({
      ...data,
      ...user,

      id: user.id
    }, "auth_users");

    return this;
  };

}

export default AuthUser;
