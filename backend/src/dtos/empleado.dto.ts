import { z } from 'zod';

export const createEmpleadoSchema = z.object({
  nombre: z.string().trim().min(1, 'nombre es requerido'),
  cargo: z.string().trim().min(1, 'cargo es requerido'),
  departamento: z.string().trim().min(1, 'departamento es requerido'),
  sueldo: z.number().positive('sueldo debe ser un número positivo'),
});

export const updateEmpleadoSchema = createEmpleadoSchema.partial();

export type CreateEmpleadoDTO = z.infer<typeof createEmpleadoSchema>;
export type UpdateEmpleadoDTO = z.infer<typeof updateEmpleadoSchema>;
