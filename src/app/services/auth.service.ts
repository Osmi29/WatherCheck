import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta la URL según tu backend
 
  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('usuario'); 
    this.router.navigate(['/home']); // Ahora sí funcionará la redirección
  }
  
  isLoggedIn(): boolean {
    const usuario = localStorage.getItem('usuario');
    return usuario !== null; // Si hay un usuario en localStorage, está autenticado
  }
  

}