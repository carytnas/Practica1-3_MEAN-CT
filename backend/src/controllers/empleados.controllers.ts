import type { Request, Response } from 'express';
import type { IEmployeeRepository } from '../repositories/IEmployeeRepository.js';
import { employeeRepository } from '../repositories/empleado.repository.js';
import { createEmpleadoSchema, updateEmpleadoSchema } from '../dtos/empleado.dto.js';
import { ok, fail } from '../utils/apiResponse.js';

// Depende únicamente de la interfaz: no conoce mongoose ni ningún ODM.
export class EmpleadoController {
  constructor(private readonly repository: IEmployeeRepository) {}

  getEmpleados = async (_req: Request, res: Response) => {
    try {
      const empleados = await this.repository.findAll();
      return ok(res, empleados);
    } catch (error) {
      console.error(error);
      return fail(res, 'Error al obtener los empleados', 500);
    }
  };

  addEmpleado = async (req: Request, res: Response) => {
    const parsed = createEmpleadoSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 'Datos de empleado inválidos', 400, parsed.error.flatten().fieldErrors);
    }
    try {
      const empleado = await this.repository.create(parsed.data);
      return ok(res, empleado, 'Empleado guardado', 201);
    } catch (error) {
      console.error(error);
      return fail(res, 'Error al guardar el empleado', 500);
    }
  };

  updateEmpleado = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) return fail(res, 'El id es requerido', 400);

    const parsed = updateEmpleadoSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 'Datos de empleado inválidos', 400, parsed.error.flatten().fieldErrors);
    }
    try {
      const empleado = await this.repository.updateById(id, parsed.data);
      if (!empleado) return fail(res, 'Empleado no encontrado', 404);
      return ok(res, empleado, 'Empleado actualizado');
    } catch (error) {
      console.error(error);
      return fail(res, 'Error al actualizar el empleado', 500);
    }
  };

  deleteEmpleado = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) return fail(res, 'El id es requerido', 400);

    try {
      const eliminado = await this.repository.deleteById(id);
      if (!eliminado) return fail(res, 'Empleado no encontrado', 404);
      return ok(res, null, 'Empleado eliminado');
    } catch (error) {
      console.error(error);
      return fail(res, 'Error al eliminar el empleado', 500);
    }
  };
}

const empleadoController = new EmpleadoController(employeeRepository);
export default empleadoController;
