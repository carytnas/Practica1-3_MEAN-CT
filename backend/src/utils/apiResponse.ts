import type { Response } from 'express';

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export function ok<T>(res: Response, data: T, message = 'OK', status = 200) {
  const body: ApiSuccessResponse<T> = { success: true, message, data };
  return res.status(status).json(body);
}

export function fail(res: Response, message: string, status = 400, errors?: unknown) {
  const body: ApiErrorResponse = { success: false, message, errors };
  return res.status(status).json(body);
}
