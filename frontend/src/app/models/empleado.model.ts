export interface Empleado {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
}

export interface EmpleadoForm {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}
