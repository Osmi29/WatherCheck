import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;
  selectedImage: File | null = null;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    this.registroForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required]),
      confirmar: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {}

  // Manejar la selección de archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Función para registrar el usuario
  async registrar() {
    if (this.registroForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error: Debe de llenar el formulario',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const { nombre, correo, contrasena, confirmar } = this.registroForm.value;

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmar) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    formData.append('contrasena', contrasena);
    formData.append('imagen', this.selectedImage!);

    try {
      await axios.post('http://localhost:3000/api/registrar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Usuario registrado con éxito',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/home']);
    } catch (err) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al registrar el usuario. Intente nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Función para cancelar y redirigir al login
  cancelar() {
    this.router.navigate(['/home']);
  }
}
