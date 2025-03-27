import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class CuentaPage implements OnInit {

  menuVisible: boolean = false;
  usuario = { Nombre: 'Invitado', Foto: '' };

  constructor(private router: Router) { }

  ngOnInit() {
     // Obtener datos del usuario desde el router state
     const navigation = this.router.getCurrentNavigation();
     if (navigation?.extras.state) {
       this.usuario = navigation.extras.state['usuario']; // Los datos del usuario que pasamos desde home.page.ts
     }
 
     console.log(this.usuario); // Verificar si los datos están siendo recibidos
   }

   cerrarSesion() {
    localStorage.removeItem('usuario'); // Borra los datos del usuario
    this.router.navigate(['/home']); // Redirige a la pantalla de inicio de sesión
  }
}
