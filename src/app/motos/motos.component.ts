import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../header/cart.service'; // Actualiza la ruta según la ubicación real del servicio

@Component({
  selector: 'app-motos',
  standalone: true,
  templateUrl: './motos.component.html',
  styleUrls: ['./motos.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [HttpClient]
})
export class MotosComponent implements OnInit {
  motos: any[] = [];
  filteredMotos: any[] = [];
  searchTerm = '';
  selectedMarcas: string[] = [];
  sortOrder = 'asc';
  minPrice = 0;
  maxPrice = Infinity;
  marcas = ['Ducati', 'BMW', 'Kawasaki', 'Honda', 'Aprilia', 'Yamaha', 'Suzuki', 'KTM', 'Triumph'];
  add_to_cart_button: string = 'Agregar al carrito'; // Inicializa la propiedad

  constructor(private http: HttpClient, private cartService: CartService) {} // Inyectar CartService

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/motos').subscribe(
      data => {
        this.motos = data;
        this.filteredMotos = data;
      },
      error => {
        console.error('Error al obtener las motos:', error);
      }
    );
  }

  applyFilters() {
    this.filteredMotos = this.motos
      .filter(moto => this.selectedMarcas.length === 0 || this.selectedMarcas.includes(moto.marca))
      .filter(moto => moto.precio >= this.minPrice && moto.precio <= (this.maxPrice === 0 ? Infinity : this.maxPrice))
      .filter(moto => moto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a, b) => this.sortOrder === 'asc' ? a.precio - b.precio : b.precio - a.precio);
  }

  onMarcaChange(marca: string, event: any) {
    if (event.target.checked) {
      this.selectedMarcas.push(marca);
    } else {
      this.selectedMarcas = this.selectedMarcas.filter(m => m !== marca);
    }
    this.applyFilters();
  }

  addToCart(moto: any) {
    this.cartService.addToCart(moto); // Añadir la moto al carrito usando el servicio
    console.log('Añadido al carrito:', moto);
  }
}
