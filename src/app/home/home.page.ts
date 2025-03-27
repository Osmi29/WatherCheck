import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, ReactiveFormsModule] // Aquí va ReactiveFormsModule en lugar de FormGroup
})
export class HomePage {
  loginForm: FormGroup;

  constructor(private alertController: AlertController, private router: Router) {
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required]),
    });
  }

  async iniciarSesion() {
    if (this.loginForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error. Llene los campos restantes',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    const { correo, contrasena } = this.loginForm.value;
  
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        Correo: correo,
        Contraseña: contrasena,
      });
  
      if (response.data.success) {
        // Guardar usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
  
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Inicio de sesión exitoso',
          buttons: ['OK'],
        });
        await alert.present();
  
        this.router.navigate(['/inicio']); // Redirige a la página principal
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error. Contraseña o correo incorrectos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  cerrarSesion() {
    localStorage.removeItem('usuario'); // Borra los datos del usuario
    this.router.navigate(['/home']); // Redirige a la pantalla de inicio de sesión
  }
  
  
}
