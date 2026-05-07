import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

import { Transform } from "class-transformer";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  @MinLength(2)
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(64)
  @MinLength(2)
  nickname?: string;
}

export class CreateUserCredentials {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  password: string;
}
