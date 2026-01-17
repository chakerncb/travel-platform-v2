import { api } from '@/src/lib/apiClient';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  blogs_count?: number;
}

export interface BlogAuthor {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: BlogCategory;
  author: BlogAuthor;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  reading_time: number;
  views: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  comments?: BlogComment[];
}

export interface BlogComment {
  id: number;
  blog_id: number;
  parent_id: number | null;
  name: string;
  email: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  replies?: BlogComment[];
}

export interface BlogsResponse {
  status: boolean;
  blogs: {
    current_page: number;
    data: Blog[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface BlogDetailResponse {
  status: boolean;
  blog: Blog;
}

export interface CommentResponse {
  status: boolean;
  message: string;
  comment: BlogComment;
}

export interface CategoriesResponse {
  status: boolean;
  categories: BlogCategory[];
}

export const blogService = {
  async getBlogs(page = 1, perPage = 8, categoryId?: number): Promise<BlogsResponse> {
    return api.get<BlogsResponse>('/v1/blogs', {
      params: { page, per_page: perPage, category: categoryId },
    });
  },

  async getBlogBySlug(slug: string): Promise<BlogDetailResponse> {
    return api.get<BlogDetailResponse>(`/v1/blogs/${slug}`);
  },

  async addComment(slug: string, data: {
    name: string;
    email: string;
    comment: string;
    parent_id?: number | null;
  }): Promise<CommentResponse> {
    return api.post<CommentResponse>(`/v1/blogs/${slug}/comments`, data);
  },

  async getCategories(): Promise<CategoriesResponse> {
    return api.get<CategoriesResponse>('/v1/blogs/categories');
  },
};
