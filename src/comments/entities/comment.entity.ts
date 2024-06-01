import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BlogPost } from '../../blog/entities/blog-post.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.comments, {
    onDelete: 'CASCADE',
  })
  blogPost: BlogPost;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;
}
