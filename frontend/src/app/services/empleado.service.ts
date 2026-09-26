import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Empleado, EmpleadoForm, ApiResponse } from '../models/empleado.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/empleados`;

  getAll(): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(this.base);
  }

  create(data: EmpleadoForm): Observable<ApiResponse<Empleado>> {
    return this.http.post<ApiResponse<Empleado>>(this.base, data);
  }

  update(id: string, data: Partial<EmpleadoForm>): Observable<ApiResponse<Empleado>> {
    return this.http.put<ApiResponse<Empleado>>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
