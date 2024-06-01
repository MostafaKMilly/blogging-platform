import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { BlogPost } from './entities/blog-post.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const { title, content, tags } = createBlogPostDto;

    const blogPost = new BlogPost();
    blogPost.title = title;
    blogPost.content = content;

    if (tags) {
      const tagEntities = await Promise.all(
        tags.map(async (tagName) => {
          let tag = await this.tagRepository.findOne({
            where: { name: tagName },
          });
          if (!tag) {
            tag = this.tagRepository.create({ name: tagName });
            await this.tagRepository.save(tag);
          }
          return tag;
        }),
      );
      blogPost.tags = tagEntities;
    }

    return this.blogPostRepository.save(blogPost);
  }

  findAll() {
    return this.blogPostRepository.find();
  }

  findOne(id: number) {
    return this.blogPostRepository.findOne({ where: { id } });
  }
}
