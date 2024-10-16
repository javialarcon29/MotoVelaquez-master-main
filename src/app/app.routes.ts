import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';  // Componente de Inicio standalone
import { MotosComponent } from './motos/motos.component';  // Componente de Motos standalone

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent }, // Ruta para el InicioComponent
  { path: 'motos', component: MotosComponent }, // Ruta para el MotosComponent
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirección por defecto a "Inicio"
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' } // Ruta de fallback
];







