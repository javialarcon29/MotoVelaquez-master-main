import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';  // Componente de Inicio standalone
import { MotosComponent } from './motos/motos.component';  // Componente de Motos standalone
import { AccesoriosComponent } from './accesorios/accesorios.component';  // Componente de Accesorios standalone
import { RopaComponent } from './ropa/ropa.component';  // Componente de Ropa standalone
import { FichaTecnicaComponent } from './ficha-tecnica/ficha-tecnica.component';  // Componente de Ficha Técnica
import { ContactoComponent } from './contacto/contacto.component';  // Componente de Ficha Técnica

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent }, // Ruta para el InicioComponent
  { path: 'motos', component: MotosComponent }, // Ruta para el MotosComponent
  { path: 'ropa', component: RopaComponent }, // Ruta para el RopaComponent
  { path: 'contacto', component: ContactoComponent }, // Ruta para el RopaComponent
  { path: 'accesorios', component: AccesoriosComponent }, // Ruta para el AccesoriosComponent
  { path: 'motos/:id', component: FichaTecnicaComponent }, // Ruta dinámica para la ficha técnica de la moto
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirección por defecto a "Inicio"
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' } // Ruta de fallback
];









