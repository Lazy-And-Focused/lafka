import type { Auth } from "@/database/generated/client";
import type { AuthTypes } from "@1/types";
import type { Profile } from "passport";

import { ApiProperty, ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";

export interface PasswordCredentials {
  username: string;
  password: string;
}

export interface SignUpByPasswordData extends PasswordCredentials {
  nickname?: string;
  email?: string;
}

export interface PassportCredentials {
  accessToken: string;
  refreshToken?: string;
}

export interface ServiceCredentials extends PassportCredentials {
  profile: Profile;
  accessToken: string;
  refreshToken?: string;
  name: AuthTypes;
}

export interface ServiceMeta {
  id: string;
  name: AuthTypes;
}

export interface SignUpData {
  username: string;
  nickname?: string;
  email?: string;
  password?: string;
  service?: ServiceMeta & PassportCredentials;
}

@ApiSchema({
  name: "AuthSchema",
})
export class AuthEntity implements Auth {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  token: string;

  @ApiPropertyOptional({ type: "string", nullable: true })
  email: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  password: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type { Auth };
