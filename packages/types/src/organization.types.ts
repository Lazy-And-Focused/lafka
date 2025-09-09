import { Link, OrganizationTag } from "./utility.types";

export interface CreateOrganization {
  name: string;
  owner_id: string;

  description?: string;
  email?: string;
  logo?: string;
  banner?: string;
}

export interface Organization {
  id: string;
  
  name: string;
  description?: string;
  email?: string;

  logo?: string;
  banner?: string;
  
  owner_id: string;
  members: string[];
  posts: string[];

  links: Link[];
  tags: OrganizationTag[];

  /* key: string, value: bigint */
  rights: Map<string, string>;
}