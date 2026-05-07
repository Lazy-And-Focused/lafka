import type { User } from "@/database/generated/client";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({
  name: "UserSchema",
})
export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export type { User };
