import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, SlicePipe } from '@angular/common';
import { EmpleadoService } from './services/empleado.service';
import type { Empleado, EmpleadoForm } from './models/empleado.model';

type ModalMode = 'crear' | 'editar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SlicePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly svc = inject(EmpleadoService);

  empleados = signal<Empleado[]>([]);
  loading = signal(false);
  toast = signal<{ msg: string; tipo: 'ok' | 'err' } | null>(null);
  modalAbierto = signal(false);
  modalMode = signal<ModalMode>('crear');
  editandoId = signal<string | null>(null);
  confirmandoId = signal<string | null>(null);

  form = signal<EmpleadoForm>({ nombre: '', cargo: '', departamento: '', sueldo: null });

  totalSueldos = computed(() =>
    this.empleados().reduce((acc, e) => acc + e.sueldo, 0)
  );

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: res => { this.empleados.set(res.data); this.loading.set(false); },
      error: () => { this.notify('Error al conectar con el servidor', 'err'); this.loading.set(false); },
    });
  }

  abrirCrear() {
    this.form.set({ nombre: '', cargo: '', departamento: '', sueldo: null });
    this.editandoId.set(null);
    this.modalMode.set('crear');
    this.modalAbierto.set(true);
  }

  abrirEditar(e: Empleado) {
    this.form.set({ nombre: e.nombre, cargo: e.cargo, departamento: e.departamento, sueldo: e.sueldo });
    this.editandoId.set(e.id);
    this.modalMode.set('editar');
    this.modalAbierto.set(true);
  }

  guardar() {
    const f = this.form();
    if (!f.nombre || !f.cargo || !f.departamento || !f.sueldo) {
      this.notify('Todos los campos son requeridos', 'err');
      return;
    }
    const payload = { ...f, sueldo: Number(f.sueldo) };
    const id = this.editandoId();

    if (id) {
      this.svc.update(id, payload).subscribe({
        next: res => { this.notify(res.message, 'ok'); this.modalAbierto.set(false); this.cargar(); },
        error: () => this.notify('Error al actualizar', 'err'),
      });
    } else {
      this.svc.create(payload as EmpleadoForm).subscribe({
        next: res => { this.notify(res.message, 'ok'); this.modalAbierto.set(false); this.cargar(); },
        error: () => this.notify('Error al crear', 'err'),
      });
    }
  }

  pedirConfirmacion(id: string) {
    this.confirmandoId.set(id);
  }

  cancelarConfirmacion() {
    this.confirmandoId.set(null);
  }

  eliminar(id: string) {
    this.svc.delete(id).subscribe({
      next: res => { this.notify(res.message, 'ok'); this.confirmandoId.set(null); this.cargar(); },
      error: () => this.notify('Error al eliminar', 'err'),
    });
  }

  patchForm(field: keyof EmpleadoForm, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  private notify(msg: string, tipo: 'ok' | 'err') {
    this.toast.set({ msg, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}
