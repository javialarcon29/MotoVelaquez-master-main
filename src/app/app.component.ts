import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Solo RouterOutlet es necesario aquí
import { HeaderComponent } from './header/header.component';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true, // Componente standalone
  imports: [RouterOutlet, HeaderComponent, CommonModule, HttpClientModule], // Importa solo RouterOutlet y HeaderComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient] // Proporcionar HttpClient aquí
})
export class AppComponent {
  title = 'MotosVelazquez';

  constructor(private http: HttpClient) { // Inyecta HttpClient
    this.fetchData(); // Llama a la función para obtener datos
  }

  fetchData() {
    this.http.get('http://localhost:3000/api/motos') // Cambia la URL a tu endpoint
      .subscribe({
        next: (data) => {
          console.log(data); // Maneja los datos recibidos
        },
        error: (error) => {
          console.error('Hubo un problema con la solicitud HTTP:', error);
        }
      });
  }
}



