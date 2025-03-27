import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, RouterModule],
})
export class ConfiguracionPage implements OnInit {
  menuVisible: boolean = false;

  // Estado y color de los sensores
  phStatus: string = 'Desactivado';
  phColor: string = 'gray';
  
  tempStatus: string = 'Desactivado';
  tempColor: string = 'gray';
  
  condStatus: string = 'Desactivado';
  condColor: string = 'gray';

  constructor(private router: Router) {}

  ngOnInit() {}

  // Métodos para el sensor de pH
  activarPH() {
    this.phStatus = 'Activo';
    this.phColor = 'green';
    alert('Sensor Activado');
  }

  desactivarPH() {
    this.phStatus = 'Desactivado';
    this.phColor = 'red';
    alert('Sensor Desactivado');
  }

  reiniciarPH() {
    this.phStatus = 'Reiniciado';
    this.phColor = 'gold';
    alert('Sensor Reiniciado');
    setTimeout(() => {
      this.phColor = 'gray';
    }, 5000);
  }

  // Métodos para el sensor de Temperatura
  activarTemp() {
    this.tempStatus = 'Activo';
    this.tempColor = 'green';
    alert('Sensor Activado');
  }

  desactivarTemp() {
    this.tempStatus = 'Desactivado';
    this.tempColor = 'red';
    alert('Sensor Desactivado');
  }

  reiniciarTemp() {
    this.tempStatus = 'Reiniciado';
    this.tempColor = 'gold';
    alert('Sensor Reiniciado');
    setTimeout(() => {
      this.tempColor = 'gray';
    }, 5000);
  }

  // Métodos para el sensor de Conductividad Eléctrica
  activarCond() {
    this.condStatus = 'Activo';
    this.condColor = 'green';
    alert('Sensor Activado');
  }

  desactivarCond() {
    this.condStatus = 'Desactivado';
    this.condColor = 'red';
    alert('Sensor Desactivado');
  }

  reiniciarCond() {
    this.condStatus = 'Reiniciado';
    this.condColor = 'gold';
    alert('Sensor Reiniciado');
    setTimeout(() => {
      this.condColor = 'gray';
    }, 5000);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario'); // Borra los datos del usuario
    this.router.navigate(['/home']); // Redirige a la pantalla de inicio de sesión
  }
  
}
