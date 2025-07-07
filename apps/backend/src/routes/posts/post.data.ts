import { ApiProperty } from "@nestjs/swagger";
import { LAFka } from "lafka/types";

export class CreatePostDto implements Partial<LAFka.LazyPost> {
  @ApiProperty()
  name: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  creator_id: string;

  @ApiProperty({
    example: ["Design", "Eat", "IT", "Other", "Programming", "Social"]
  })
  tags: LAFka.Tag<false>[];

  @ApiProperty({
    examples: [
      "blog",
      "forum"
    ]
  })
  type: "blog" | "forum";
}

export class UpdatePostDto implements Partial<LAFka.LazyPost> {
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  content: string;
  
  @ApiProperty()
  description?  : string;
  
  @ApiProperty({
    examples: ["open", "limited", "link"]
  })
  status: "open" | "limited" | "link";
};