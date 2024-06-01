import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
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

  async update(
    id: number,
    updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }

    const { title, content, tags } = updateBlogPostDto;
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

  async delete(id: number): Promise<void> {
    const result = await this.blogPostRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }
  }
}
