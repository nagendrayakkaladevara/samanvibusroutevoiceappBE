export interface User {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    username: string;
  };
}


export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
} 
