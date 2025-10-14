export interface ApiResponse<T = null> {
  data?: T | null;
  isSuccess: boolean;
  message?: string;
  errors?: ErrorDto;
}

export class ErrorDto {
  [key: string]: string[];
}

export interface ISearchRequest {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface IMeta {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DataFormProps<T, R = T> {
  data?: T;
  onSave: (data: R) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface FileLinkResponse {
  id?: string;
  fileName: string;
  contentType: string;
  fileUrl: string;
}
