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
});
