import { Rights as LAFkaRights, Organization, Post, User } from "@lafka/types";
import { BitField } from "fbit-field";

type MustArray<T, K=T> = [T, ...K[]];

const resolveArrayToBigInt = <T extends LAFkaRights.Keys>(rightKey: T, ...rights: LAFkaRights.Rights<T>[]) =>
  BitField.summarize(...rights.map(key => LAFkaRights.CONSTANTS.object.available[rightKey][key]) as any);

type RightsOnly<T extends { rights: unknown, id: unknown }, K extends keyof T | never = never> = {
  [P in K]: T[P];
} & {
  rights: T["rights"],
  id: T["id"]
};

export namespace Rights {
  export class UserService {
    public constructor(public readonly user: RightsOnly<User>) {};

    public has = <
      T extends keyof LAFkaRights.My,
    >(...rights: T[]): boolean => {
      const r = resolveArrayToBigInt("my", ...rights);

      return (BigInt(this.user.rights) & r) === r;
    }

    public hasPostRights(post: RightsOnly<Post, "creator_id">) {
      return new PostService(post).userHas(this.user.id);
    };

    public hasOrganizationRights(organization: RightsOnly<Organization, "owner_id"|"members">) {
      return new OrganizationService(organization).userHas(this.user.id);
    }
  }

  export class PostService {
    public constructor(private readonly post: RightsOnly<Post, "creator_id">) {};

    public readonly hasRights = <
      T extends keyof LAFkaRights.Posts
    >(...rights: T[]): ((userId: string) => boolean) => {
      const r = resolveArrayToBigInt("posts", ...rights);
      
      return (userId: string) => {
        if (this.post.creator_id === userId) return true;

        return (BigInt(this.post.rights.get(userId) || LAFkaRights.CONSTANTS.raw.default.posts) & r) === r;
      };
    };

    public readonly userHas = <
      T extends keyof LAFkaRights.Posts
    >(userId: string): ((...rights: T[]) => boolean) => {
      return (...rights: T[]) => {
        if (this.post.creator_id === userId) return true;
        
        const r = resolveArrayToBigInt("posts", ...rights);
        return (BigInt(this.post.rights.get(userId) || LAFkaRights.CONSTANTS.raw.default.posts) & r) === r;
      };
    }

    public readonly has = <
      T extends keyof LAFkaRights.Posts
    >({ rights, userId }: { rights: MustArray<T>, userId: string }): boolean => {
      if (this.post.creator_id === userId) return true;
      return this.hasRights(...rights)(userId);
    };
  }

  export class OrganizationService {
    public constructor(public readonly organization: RightsOnly<Organization, "owner_id"|"members">) {};

    public readonly hasRights = <
      T extends keyof LAFkaRights.Organizations
    >(...rights: T[]): ((userId: string) => boolean) => {
      const r = resolveArrayToBigInt("organizations", ...rights);

      return (userId: string) => {
        if (this.organization.owner_id === userId) return true;
        return ((this.organization.members.includes(userId)
          ? BigInt(this.organization.rights.get(userId) || LAFkaRights.CONSTANTS.raw.default.organizations)
          : LAFkaRights.CONSTANTS.raw.default.organizations) & r) === r;
      };
    };

    public readonly userHas = <
      T extends keyof LAFkaRights.Organizations
    >(userId: string): ((...rights: T[]) => boolean) => {
      return (...rights: T[]) => {
        if (this.organization.owner_id === userId) return true;

        const r = resolveArrayToBigInt("organizations", ...rights);
        return ((this.organization.members.includes(userId)
          ? BigInt(this.organization.rights.get(userId) || LAFkaRights.CONSTANTS.raw.default.organizations)
          : LAFkaRights.CONSTANTS.raw.default.organizations) & r) === r;
      };
    }

    public readonly has = <
      T extends keyof LAFkaRights.Organizations
    >({ rights, userId }: { rights: MustArray<T>, userId: string}): boolean => {
      if (this.organization.owner_id === userId) return true;
      
      return this.hasRights(...rights)(userId);
    };
  }
}