import type { Organization, Post, User } from "@lafka/types";

import { Rights } from "@lafka/types";

import { BitField } from "fbit-field";

type MustArray<T, K = T> = [T, ...K[]];

const AVAILABLE_RIGHTS = Rights.CONSTANTS.object.available
const DEFAULT_RIGHTS = Rights.CONSTANTS.raw.default;

const resolveArrayRightsToBigInt = <T extends Rights.Keys>(
  rightKey: T,
  ...rights: Rights.Rights<T>[]
) => {
  const data = rights.map(key =>
    AVAILABLE_RIGHTS[rightKey][key] as bigint);

  return BitField.summarize(...data);
}

type RightsOnly<
  T extends { rights: unknown; id: unknown },
  K extends keyof T | never = never,
> = {
  [P in K]: T[P];
} & {
  rights: T["rights"];
  id: T["id"];
};

export class UserService {
  public constructor(public readonly user: RightsOnly<User>) {}

  public has<T extends keyof Rights.My>(...rights: T[]): boolean {
    const resolvedRights = resolveArrayRightsToBigInt("my", ...rights);

    return BitField.equals(this.user.rights, resolvedRights);
  };

  public hasPostRights(post: RightsOnly<Post, "creator_id">) {
    return new PostService(post).userHas(this.user.id);
  }

  public hasOrganizationRights(
    organization: RightsOnly<Organization, "owner_id" | "members">,
  ) {
    return new OrganizationService(organization).userHas(this.user.id);
  }
}

export class PostService {
  public constructor(private readonly post: RightsOnly<Post, "creator_id">) {}

  public getUserRights(userId: string) {
    return this.post.rights.get(userId) || DEFAULT_RIGHTS.posts;
  }

  public hasRights<T extends keyof Rights.Posts>(
    ...rights: T[]
  ): ((userId: string) => boolean) {
    const resolvedRights = resolveArrayRightsToBigInt("posts", ...rights);

    return (userId: string) => {
      if (this.post.creator_id === userId) return true;
      const userRights = this.getUserRights(userId);

      return BitField.equals(userRights, resolvedRights);
    };
  };

  public userHas<T extends keyof Rights.Posts>(
    userId: string,
  ): ((...rights: T[]) => boolean) {
    const userRights = this.getUserRights(userId);

    return (...rights: T[]) => {
      if (this.post.creator_id === userId) return true;

      const resolvedRights = resolveArrayRightsToBigInt("posts", ...rights);
      return BitField.equals(userRights, resolvedRights);
    };
  };

  public has<T extends keyof Rights.Posts>({
    rights,
    userId,
  }: {
    rights: MustArray<T>;
    userId: string;
  }): boolean {
    if (this.post.creator_id === userId) return true;
    return this.hasRights(...rights)(userId);
  };
}

export class OrganizationService {
  public constructor(
    public readonly organization: RightsOnly<
      Organization,
      "owner_id" | "members"
    >,
  ) {}

  public getUserRights(userId: string) {
    return BigInt(this.organization.members.includes(userId)
      ? this.organization.rights.get(userId) || DEFAULT_RIGHTS.organizations
      : DEFAULT_RIGHTS.organizations);
  }

  public hasRights<T extends keyof Rights.Organizations>(
    ...rights: T[]
  ): ((userId: string) => boolean) {
    const resolvedRights = resolveArrayRightsToBigInt("organizations", ...rights);

    return (userId: string) => {
      if (this.organization.owner_id === userId) return true;
      
      const userRights = this.getUserRights(userId);
      return BitField.equals(userRights, resolvedRights);
    };
  };

  public userHas<T extends keyof Rights.Organizations>(
    userId: string,
  ): ((...rights: T[]) => boolean) {
    const userRights = this.getUserRights(userId);

    return (...rights: T[]) => {
      if (this.organization.owner_id === userId) return true;

      const resolvedRights = resolveArrayRightsToBigInt("organizations", ...rights);
      
      return BitField.equals(userRights, resolvedRights);
    };
  };

  public has<T extends keyof Rights.Organizations>({
    rights,
    userId,
  }: {
    rights: MustArray<T>;
    userId: string;
  }): boolean {
    if (this.organization.owner_id === userId) return true;

    return this.hasRights(...rights)(userId);
  };
}
