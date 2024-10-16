import { Component, OnInit } from '@angular/core';
import { CartService } from '../header/cart.service'; // Actualiza la ruta según la ubicación real del servicio
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // Agrega CommonModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0; // Variable para almacenar el número de productos
  isModalVisible: boolean = false; // Controla la visibilidad del modal
  lastAddedProduct: any; // Almacena el último producto añadido

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el carrito
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.length; // Actualizar el contador
      this.lastAddedProduct = cart[cart.length - 1]; // Guardar el último producto añadido
      console.log('Último producto añadido:', this.lastAddedProduct); // Verifica que el producto tenga la imagen
    });
  }

  showModal() {
    this.isModalVisible = true; // Mostrar el modal
    // Asegúrate de que lastAddedProduct tenga la imagen en formato Base64
  }

  hideModal() {
    this.isModalVisible = false; // Ocultar el modal
  }

  eliminarProducto() {
    // Lógica para eliminar el último producto añadido
    this.cartService.eliminarUltimoProducto(); // Asegúrate de que este método esté implementado en tu servicio
    this.lastAddedProduct = null; // Limpiar el último producto mostrado
    this.cartItemCount = Math.max(0, this.cartItemCount - 1); // Actualizar el contador
  }
}
