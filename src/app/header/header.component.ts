import { Component, OnInit } from '@angular/core';
import { CartService } from '../header/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0; // Número de productos en el carrito
  isModalVisible: boolean = false; // Controla la visibilidad del modal
  cartItems: any[] = []; // Lista de productos en el carrito
  lastAddedProduct: any; // Último producto añadido

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Recuperar el carrito almacenado en localStorage al cargar la página
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartItemCount = this.cartItems.length; // Actualizar el contador
    }

    // Suscribirse a los cambios en el carrito del servicio
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart; // Actualiza los productos en el carrito
      this.cartItemCount = cart.length; // Actualizar el contador de productos
      this.lastAddedProduct = cart[cart.length - 1]; // Guardar el último producto añadido

      // Guardar el carrito en localStorage
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      console.log('Último producto añadido:', this.lastAddedProduct);
    });
  }

  showModal() {
    this.isModalVisible = true; // Mostrar el modal
  }

  hideModal() {
    this.isModalVisible = false; // Ocultar el modal
  }

  eliminarProducto(index: number) {
    // Eliminar producto por su índice
    this.cartItems.splice(index, 1); // Elimina el producto de la lista
    this.cartItemCount = this.cartItems.length; // Actualizar el contador de productos

    // Actualizar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));

    // Si el carrito está vacío, también se puede eliminar del localStorage
    if (this.cartItemCount === 0) {
      localStorage.removeItem('cart');
    }
  }

  comprar() {
    // Lógica para comprar los productos del carrito
    if (this.cartItems.length > 0) {
      // Realizar la compra (puede ser una llamada a un servicio o redirigir a otra página)
      console.log('Comprando productos:', this.cartItems);

      // Limpiar el carrito después de la compra
      this.cartItems = [];
      this.cartItemCount = 0;
      localStorage.removeItem('cart'); // Eliminar el carrito del localStorage
    }
  }
}

