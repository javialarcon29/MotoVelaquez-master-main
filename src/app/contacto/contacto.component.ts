import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para formularios
import { CommonModule } from '@angular/common'; // Necesario para algunas directivas básicas
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-contacto',
  standalone: true, // Componente standalone
  imports: [FormsModule, CommonModule], // Asegúrate de importar FormsModule aquí
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  constructor() { }

  onSubmit() {
    Swal.fire({
      title: '¡Gracias!',
      text: 'Nos pondremos en contacto contigo pronto.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }
}
