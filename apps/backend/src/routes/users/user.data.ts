import { ApiProperty } from "@nestjs/swagger";
import { User } from "lafka/types";

export class UserUpdateDto implements Partial<User> {
  @ApiProperty()
  nickname?: string;
  
  @ApiProperty()
  avatar?: string;
  
  @ApiProperty()
  biography?: string;
};