import { ApiProperty } from "@nestjs/swagger";
import { LAFka } from "lafka/types";

export class UserUpdateDto implements Partial<LAFka.User> {
  @ApiProperty()
  nickname?: string;
  
  @ApiProperty()
  avatar?: string;
  
  @ApiProperty()
  biography?: string;
};