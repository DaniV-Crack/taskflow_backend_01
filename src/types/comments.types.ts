import { Comment } from "@prisma/client";

export type CommentPublic = Comment;

export interface CreateCommentDto {
  content: string;
  taskId: string;
}
