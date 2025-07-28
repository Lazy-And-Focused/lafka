import { ApiProperty } from "@nestjs/swagger";
import { CreateComment, LazyPost, PostTag } from "lafka/types";

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

export class CreateCommentDto implements Omit<CreateComment, "author_id"|"post_id"> {
  @ApiProperty()
  content: string;
  
  @ApiProperty()
  reply?: string;
};