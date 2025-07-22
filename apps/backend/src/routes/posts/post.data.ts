import { ApiProperty } from "@nestjs/swagger";
import { LazyPost, PostTag } from "lafka/types";

export class CreatePostDto implements Partial<LazyPost> {
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
  tags: PostTag[];

  @ApiProperty({
    examples: [
      "blog",
      "forum"
    ]
  })
  type: "blog" | "forum";
}

export class UpdatePostDto implements Partial<LazyPost> {
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