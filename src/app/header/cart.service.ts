import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  // Métodos para manipular el carrito
  addToCart(item: any) {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next([...currentCart, item]);
  }

  eliminarUltimoProducto() {
    // Lógica para eliminar el último producto del carrito
    const currentCart = this.cartSubject.value; // Obtener el carrito actual
    currentCart.pop(); // Eliminar el último producto
    this.cartSubject.next(currentCart); // Actualizar el carrito
  }

  eliminarProductosSeleccionados(productosAEliminar: any[]) {
    // Lógica para eliminar productos seleccionados del carrito
    const currentCart = this.cartSubject.value; // Obtener el carrito actual
    const nuevosProductos = currentCart.filter(item => !productosAEliminar.includes(item)); // Filtrar los productos no seleccionados

    if (nuevosProductos.length === 0) {
      console.log("No hay productos en tu carrito"); // Mensaje si el carrito está vacío
    }

    this.cartSubject.next(nuevosProductos); // Actualizar el carrito
  }

  agregarProducto(producto: any) {
    // Lógica para agregar un producto al carrito
    const currentCart = this.cartSubject.value; // Obtener el carrito actual
    currentCart.push(producto); // Agregar el nuevo producto

    // Verificar si la imagen del producto es válida
    if (!producto.imagen || !this.validarImagen(producto.imagen)) {
      console.log("La imagen del producto no es válida"); // Mensaje si la imagen no es válida
      return; // Salir del método si la imagen no es válida
    }

    this.cartSubject.next(currentCart); // Actualizar el carrito
  }

  private validarImagen(imagen: string): boolean {
    // Lógica para validar la URL de la imagen
    return imagen.startsWith('http://') || imagen.startsWith('https://'); // Ejemplo de validación
  }

  // ... otros métodos según sea necesario ...
}
