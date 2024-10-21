import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importamos FormsModule para manejar el ngModel

@Component({
  selector: 'app-ficha-tecnica',
  standalone: true,
  templateUrl: './ficha-tecnica.component.html',
  styleUrls: ['./ficha-tecnica.component.css'],
  imports: [CommonModule, FormsModule],
})
export class FichaTecnicaComponent implements OnInit {
  moto: any = null;
  motoId: string | null = null;
  currentInterestRate: number = 5.0; // Tasa de interés inicial
  years: number = 1; // Años de financiación
  cuotaMensual: number | null = null; // Resultado de la cuota mensual
  entrada: number = 0; // Entrada inicial
  ultimaCuota: number = 0; // Última cuota, opcional

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.motoId = this.route.snapshot.paramMap.get('id');

    if (this.motoId) {
      this.http.get<any>(`http://localhost:3000/api/motos/${this.motoId}`).subscribe(
        (data) => {
          this.moto = data;
        },
        (error) => {
          console.error('Error al obtener la ficha técnica:', error);
        }
      );
    }

    this.getCurrentInterestRate();
  }

  getCurrentInterestRate(): void {
    // Aquí puedes conectar con una API real para obtener la tasa de interés actual
    // Por ahora, simulamos una tasa de interés fija del 5%
    this.http.get<any>('https://api.interesmercado.com/tasa-actual').subscribe(
      (data) => {
        this.currentInterestRate = data.rate;
      },
      (error) => {
        console.error('Error al obtener la tasa de interés:', error);
      }
    );
  }

  calcularFinanciacion(): void {
    if (this.moto && this.moto.precio) {
      const precio = this.moto.precio;
      const interesMensual = this.currentInterestRate / 100 / 12;
      const numeroMeses = this.years * 12;

      // Si hay entrada inicial, restamos del precio total
      const montoFinanciado = precio - this.entrada;

      // Calculamos las cuotas mensuales estándar
      const cuotaRegular = (montoFinanciado * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroMeses + 1));

      // Ajuste para la última cuota si es diferente
      if (this.ultimaCuota > 0) {
        // Recalculamos el total de las cuotas regulares y ajustamos la última cuota
        const montoRegular = montoFinanciado - this.ultimaCuota;
        this.cuotaMensual = (montoRegular * interesMensual) / (1 - Math.pow(1 + interesMensual, -(numeroMeses - 1)));
      } else {
        // Si no hay última cuota distinta, usamos la cuota regular
        this.cuotaMensual = cuotaRegular;
      }
    }
  }
}

