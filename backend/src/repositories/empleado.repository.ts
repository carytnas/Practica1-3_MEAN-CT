import EmpleadoModel from '../models/empleado.js';
import type { Empleado } from '../domain/empleado.js';
import type { CreateEmpleadoDTO, UpdateEmpleadoDTO } from '../dtos/empleado.dto.js';
import type { IEmployeeRepository } from './IEmployeeRepository.js';

// Único punto del proyecto que conoce el shape del documento de Mongoose.
function toDomain(doc: any): Empleado {
  return {
    id: doc._id.toString(),
    nombre: doc.nombre,
    cargo: doc.cargo,
    departamento: doc.departamento,
    sueldo: doc.sueldo,
  };
}

export class MongooseEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Empleado[]> {
    const docs = await EmpleadoModel.find().lean();
    return docs.map(toDomain);
  }

  async findById(id: string): Promise<Empleado | null> {
    try {
      const doc = await EmpleadoModel.findById(id).lean();
      return doc ? toDomain(doc) : null;
    } catch {
      return null; // id con formato inválido para el ODM
    }
  }

  async create(data: CreateEmpleadoDTO): Promise<Empleado> {
    const doc = await EmpleadoModel.create(data);
    return toDomain(doc);
  }

  async updateById(id: string, data: UpdateEmpleadoDTO): Promise<Empleado | null> {
    try {
      const doc = await EmpleadoModel.findByIdAndUpdate(id, data, { new: true }).lean();
      return doc ? toDomain(doc) : null;
    } catch {
      return null;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const doc = await EmpleadoModel.findByIdAndDelete(id);
      return doc !== null;
    } catch {
      return false;
    }
  }
}

export const employeeRepository: IEmployeeRepository = new MongooseEmployeeRepository();
