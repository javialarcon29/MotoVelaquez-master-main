import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../header/cart.service'; // Actualiza la ruta según la ubicación real del servicio

@Component({
  selector: 'app-ropa',
  standalone: true,
  templateUrl: './ropa.component.html',
  styleUrls: ['./ropa.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [HttpClient]
})
export class RopaComponent implements OnInit {
  ropa: any[] = [];
  filteredRopa: any[] = [];
  searchTerm = '';
  selectedCategorias: string[] = [];
  sortOrder = 'asc';
  minPrice = 0;
  maxPrice = Infinity;
  categorias = ['cascos', 'guantes', 'escape', 'monos', 'botas'];

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/ropa').subscribe(
      data => {
        this.ropa = data;
        this.filteredRopa = data;
      },
      error => {
        console.error('Error al obtener la ropa:', error);
      }
    );
  }

  applyFilters() {
    this.filteredRopa = this.ropa
      .filter(prenda => this.selectedCategorias.length === 0 || this.selectedCategorias.includes(prenda.categoria))
      .filter(prenda => prenda.precio >= this.minPrice && prenda.precio <= (this.maxPrice === 0 ? Infinity : this.maxPrice))
      .filter(prenda => prenda.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a, b) => this.sortOrder === 'asc' ? a.precio - b.precio : b.precio - a.precio);
  }

  onCategoriaChange(categoria: string, event: any) {
    if (event.target.checked) {
      this.selectedCategorias.push(categoria);
    } else {
      this.selectedCategorias = this.selectedCategorias.filter(c => c !== categoria);
    }
    this.applyFilters();
  }

  addToCart(prenda: any) {
    this.cartService.addToCart(prenda); // Añadir la prenda de ropa al carrito usando el servicio
    console.log('Añadido al carrito:', prenda);
  }
}
