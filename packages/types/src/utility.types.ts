export const POST_STATUS = {
  blocked: "blocked",
  closed: "closed",
  open: "open",
} as const;
export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export const ORGANIZATION_TAGS = [

] as const;

export const POST_TAGS = [
  "Design",
  "Eat",
  "IT",
  "Other",
  "Programming",
  "Social",
] as const;

export const LAZY_POST_TAGS: readonly string[] = POST_TAGS;
export const LAZY_ORGANIZATION_TAGS: readonly string[] = ORGANIZATION_TAGS;

export type OrganizationTagNames = (typeof ORGANIZATION_TAGS)[number];
export type PostTagNames = (typeof POST_TAGS)[number];

export type OrganizationTag = {
  id: string,
  name: OrganizationTagNames
};

export type PostTag = {
  id: string;
  name: PostTagNames;
};

export type Link = {
  name: string;
  url: string;
};