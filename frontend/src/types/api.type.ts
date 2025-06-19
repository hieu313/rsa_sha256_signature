export type ApiResponse = {
  success: boolean;
  message: string;
  timestamp: string;
};
export type SuccessResponse<T> = ApiResponse & {
  data: T;
};
export type ErrorResponse = ApiResponse & {
  code: number;
  error: string;
};
