import type { Request, Response } from 'express';
import { EmpleadoController } from './empleados.controllers';
import type { IEmployeeRepository } from '../repositories/IEmployeeRepository';

describe('Unit Test: EmpleadoController (Mantenibilidad & Testabilidad)', () => {
  let controller: EmpleadoController;
  let mockRepository: jest.Mocked<IEmployeeRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };

    controller = new EmpleadoController(mockRepository);

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
  });

  it('Debería retornar un estado 200 y la lista de empleados de la abstracción', async () => {
    const fakeEmployees = [
      { id: '1', nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 },
    ];

    mockRepository.findAll.mockResolvedValue(fakeEmployees);
    mockRequest = {};

    await controller.getEmpleados(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'OK',
      data: fakeEmployees,
    });
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('Debería crear un empleado y retornar 201 con los datos guardados', async () => {
    const nuevoEmpleado = { id: '2', nombre: 'Laura Ríos', cargo: 'Dev', departamento: 'TI', sueldo: 3000 };

    mockRepository.create.mockResolvedValue(nuevoEmpleado);
    mockRequest = {
      body: { nombre: 'Laura Ríos', cargo: 'Dev', departamento: 'TI', sueldo: 3000 },
    };

    await controller.addEmpleado(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado guardado',
      data: nuevoEmpleado,
    });
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it('Debería retornar 400 si el body de creación es inválido (Zod)', async () => {
    mockRequest = {
      body: { nombre: '', cargo: 'Dev', departamento: 'TI', sueldo: -100 },
    };

    await controller.addEmpleado(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('Debería actualizar un empleado y retornar 200 con los datos actualizados', async () => {
    const empleadoActualizado = { id: '3', nombre: 'Carlos Vega', cargo: 'Lead', departamento: 'TI', sueldo: 5000 };

    mockRepository.updateById.mockResolvedValue(empleadoActualizado);
    mockRequest = {
      params: { id: '3' },
      body: { cargo: 'Lead', sueldo: 5000 },
    };

    await controller.updateEmpleado(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado actualizado',
      data: empleadoActualizado,
    });
    expect(mockRepository.updateById).toHaveBeenCalledWith('3', { cargo: 'Lead', sueldo: 5000 });
  });

  it('Debería retornar 404 si el empleado a actualizar no existe', async () => {
    mockRepository.updateById.mockResolvedValue(null);
    mockRequest = {
      params: { id: '999' },
      body: { cargo: 'Lead' },
    };

    await controller.updateEmpleado(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
  });

  it('Debería eliminar un empleado y retornar 200 con mensaje de confirmación', async () => {
    mockRepository.deleteById.mockResolvedValue(true);
    mockRequest = { params: { id: '1' } };

    await controller.deleteEmpleado(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado eliminado',
      data: null,
    });
    expect(mockRepository.deleteById).toHaveBeenCalledWith('1');
  });

  it('Debería retornar 404 si el empleado a eliminar no existe', async () => {
    mockRepository.deleteById.mockResolvedValue(false);
    mockRequest = { params: { id: '999' } };

    await controller.deleteEmpleado(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
  });
});
