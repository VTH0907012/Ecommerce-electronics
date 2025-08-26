export interface ErrorResponse {
  message?: string;
  status?: number;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}