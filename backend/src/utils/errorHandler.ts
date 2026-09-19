import type { NextFunction, Request, Response } from 'express';
import { fail } from './apiResponse.js';

export function notFoundHandler(_req: Request, res: Response) {
  fail(res, 'Recurso no encontrado', 404);
}

// Middleware final: nunca expone stack traces ni errores crudos al cliente.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  fail(res, 'Error interno del servidor', 500);
}
