import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink],
})
export class InicioPage implements OnInit {
  menuVisible: boolean = false;
  estadoContenedor: number = 1; // Puedes cambiar el valor según tu lógica

 


  //obtencion del usuario o sus datos del inicio de sesion
  usuario = { Nombre: 'Invitado', Foto: '' };

  constructor(private router: Router) {}
  analizar() {
    console.log("Analizando...");
  }

  vaciarContenedor() {
    console.log("Vaciando contenedor...");
  }

  cerrarSesion() {
    localStorage.removeItem('usuario'); // Borra los datos del usuario
    this.router.navigate(['/home']); // Redirige a la pantalla de inicio de sesión
  }

  ngOnInit() {
    // Obtener datos del usuario desde el router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['usuario']; // Los datos del usuario que pasamos desde home.page.ts
    }

    console.log(this.usuario); // Verificar si los datos están siendo recibidos
  }
  
}
