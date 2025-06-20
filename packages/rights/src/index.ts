import { LAFka, Rights as LAFkaRights } from "@lafka/types";

type MustArray<T, K=T> = [T, ...K[]];
type ArrayOrType<T> = MustArray<T> | T;

export namespace Rights {
  export class UserService {
    public constructor(public readonly user: LAFka.User) {};

    public has = <
      T extends ArrayOrType<keyof LAFkaRights.Types.My>,
    >(rights: T): boolean => {
      const r = LAFkaRights.Parser.toBigIntFromArray("My", Array.isArray(rights) ? rights : [rights]);

      return (BigInt(this.user.rights) & r) === r;
    }

    public hasPostRights(post: LAFka.Post) {
      return new PostService(post).userHas(this.user.id);
    };

    public hasOrganizationRights(organization: LAFka.Organization) {
      return new OrganizationService(organization).userHas(this.user.id);
    }
  }

  export class PostService {
    public constructor(private readonly post: LAFka.Post) {};

    public readonly hasRights = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Posts>
    >(rights: T): ((userId: string) => boolean) => {
      const r = LAFkaRights.Parser.toBigIntFromArray("Posts", Array.isArray(rights) ? rights : [rights]);
      return (userId: string) => {
        if (this.post.creator_id === userId) return true;

        return (BigInt(this.post.rights.get(userId) || LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Posts) & r) === r;
      };
    };

    public readonly userHas = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Posts>
    >(userId: string): ((rights: T) => boolean) => {
      return (rights: T) => {
        if (this.post.creator_id === userId) return true;
        
        const r = LAFkaRights.Parser.toBigIntFromArray("Posts", Array.isArray(rights) ? rights : [rights]);
        return (BigInt(this.post.rights.get(userId) || LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Posts) & r) === r;
      };
    }

    public readonly has = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Posts>
    >({ rights, userId }: { rights: T, userId: string }): boolean => {
      if (this.post.creator_id === userId) return true;
      return this.hasRights(rights)(userId);
    };
  }

  export class OrganizationService {
    public constructor(public readonly organization: LAFka.Organization) {};

    public readonly hasRights = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Organizations>
    >(rights: T): ((userId: string) => boolean) => {
      const r = LAFkaRights.Parser.toBigIntFromArray("Organizations", Array.isArray(rights) ? rights : [rights]);

      return (userId: string) => {
        if (this.organization.owner_id === userId) return true;
        return ((this.organization.members.includes(userId)
          ? BigInt(this.organization.rights.get(userId) || LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Organizations)
          : LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Organizations) & r) === r;
      };
    };

    public readonly userHas = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Organizations>
    >(userId: string): ((rights: T) => boolean) => {
      return (rights: T) => {
        if (this.organization.owner_id === userId) return true;

        const r = LAFkaRights.Parser.toBigIntFromArray("Organizations", Array.isArray(rights) ? rights : [rights]);
        return ((this.organization.members.includes(userId)
          ? BigInt(this.organization.rights.get(userId) || LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Organizations)
          : LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Organizations) & r) === r;
      };
    }

    public readonly has = <
      T extends ArrayOrType<keyof LAFkaRights.Types.Organizations>
    >({ rights, userId }: { rights: T, userId: string}): boolean => {
      if (this.organization.owner_id === userId) return true;
      
      return this.hasRights(rights)(userId);
    };
  }
}