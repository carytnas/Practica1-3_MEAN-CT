import type { Empleado } from '../domain/empleado.js';
import type { CreateEmpleadoDTO, UpdateEmpleadoDTO } from '../dtos/empleado.dto.js';

// Contrato agnóstico al ODM/DB: la capa HTTP solo conoce esta interfaz.
export interface IEmployeeRepository {
  findAll(): Promise<Empleado[]>;
  findById(id: string): Promise<Empleado | null>;
  create(data: CreateEmpleadoDTO): Promise<Empleado>;
  updateById(id: string, data: UpdateEmpleadoDTO): Promise<Empleado | null>;
  deleteById(id: string): Promise<boolean>;
}
