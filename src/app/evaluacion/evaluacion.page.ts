import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.page.html',
  styleUrls: ['./evaluacion.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule,CommonModule, FormsModule],
})
export class EvaluacionPage implements OnInit {
  @ViewChild('graficaPastel', { static: false }) graficaPastel!: ElementRef;

  menuVisible: boolean = false;

  // Valores iniciales
  ph: number | null = null;
  temperatura: number | null = null;
  conductividad: number | null = null;

  mostrarGrafica: boolean = false;
  chart: any;

  constructor(private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit() {}

  // Método para determinar el color del input según el valor
  getColorClase(tipo: string): string {
    const valor = this[tipo as keyof EvaluacionPage]; // Obtener el valor dinámicamente
    if (valor === null || valor === undefined) return '';

    switch (tipo) {
      case 'ph':
        if (valor < 4.0 || valor > 9.5) return 'critico';
        if (valor >= 4.0 && valor <= 5.0) return 'muy-malo';
        if (valor > 5.0 && valor <= 6.0) return 'malo';
        if (valor > 6.0 && valor <= 6.5) return 'aceptable';
        if (valor > 6.5 && valor <= 7.0) return 'bueno';
        if (valor > 7.0 && valor <= 7.5) return 'muy-bueno';
        if (valor > 7.5 && valor <= 8.0) return 'aceptable';
        if (valor > 8.0 && valor <= 8.5) return 'malo';
        if (valor > 8.5 && valor <= 9.5) return 'muy-malo';
        return '';
      case 'temperatura':
        if (valor < 0 || valor > 40) return 'critico';
        if (valor >= 0 && valor <= 10) return 'muy-malo';
        if (valor > 10 && valor <= 15) return 'malo';
        if (valor > 15 && valor <= 20) return 'aceptable';
        if (valor > 20 && valor <= 22) return 'bueno';
        if (valor > 22 && valor <= 25) return 'muy-bueno';
        if (valor > 25 && valor <= 30) return 'aceptable';
        if (valor > 30 && valor <= 35) return 'malo';
        if (valor > 35 && valor <= 40) return 'muy-malo';
        return '';
      case 'conductividad':
        if (valor > 2000) return 'critico';
        if (valor >= 1500 && valor <= 2000) return 'muy-malo';
        if (valor >= 1000 && valor < 1500) return 'malo';
        if (valor >= 500 && valor < 1000) return 'aceptable';
        if (valor >= 250 && valor < 500) return 'bueno';
        if (valor < 250) return 'muy-bueno';
        return '';
      default:
        return '';
    }
  }

  borrarDatos() {
    this.ph = null;
    this.temperatura = null;
    this.conductividad = null;
    this.mostrarGrafica = false;  // Ocultar la gráfica
    this.chart?.destroy(); // Destruir la gráfica si existe
  }
  

  // Método para actualizar el color del input
  actualizarColorInput(tipo: string) {
    // No necesitamos hacer nada aquí, Angular se encarga de actualizar las clases
  }

  mostrarEvaluacion() {
    this.mostrarGrafica = true;
    setTimeout(() => {
      this.crearGraficaPastel();
    }, 0); // Ejecuta después del ciclo de Angular
  }
  

  crearGraficaPastel() {
    if (this.chart) {
      this.chart.destroy();
    }
  
    const ctx = this.graficaPastel.nativeElement.getContext('2d');
    console.log(ctx);  // Verifica si el contexto se obtiene correctamente
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['pH', 'Temperatura', 'Conductividad'],
          datasets: [
            {
              data: [this.ph || 0, this.temperatura || 0, this.conductividad || 0],
              backgroundColor: ['#007bff', '#28a745', '#ffc107'],
            },
          ],
        },
      });
    }
  }

  descargarGrafica() {
    const canvas = this.graficaPastel.nativeElement;
    const imgData = canvas.toDataURL('image/png');
    console.log(imgData);  // Verifica que la imagen se haya generado correctamente
    if (imgData) {
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 100);
      pdf.save('evaluacion_agua.pdf');
    } else {
      console.error('Error al generar la imagen de la gráfica');
    }
  }
  

  copiarDatos() {
    const datos = `pH: ${this.ph}, Temperatura: ${this.temperatura}°C, Conductividad: ${this.conductividad}µS/cm`;
    navigator.clipboard.writeText(datos).then(() => {
      alert('Datos copiados al portapapeles');
    });
  }

  cerrarSesion() {
    localStorage.removeItem('usuario'); // Borra los datos del usuario
    this.router.navigate(['/home']); // Redirige a la pantalla de inicio de sesión
  }
}