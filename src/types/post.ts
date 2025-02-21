export interface CreatePostDTO {
  content: string;
  mediaUrl?: string;
  scheduledAt?: string; // ISO date string
  teamId: string;
}

export interface UpdatePostDTO {
  content?: string;
  mediaUrl?: string;
  scheduledAt?: string | null;
}

export interface PostResponse {
  id: string;
  content: string;
  mediaUrl?: string;
  scheduledAt?: Date;
  status: string;
  userId: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}
