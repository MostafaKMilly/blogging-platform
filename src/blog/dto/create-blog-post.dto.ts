import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'My First Blog Post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the blog post',
    example: 'This is the content of my first blog post...',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Tags associated with the blog post',
    example: ['nestjs', 'typescript', 'swagger'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
