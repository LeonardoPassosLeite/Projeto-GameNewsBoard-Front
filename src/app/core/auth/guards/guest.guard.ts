import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getProfile().pipe(
      map((res) => {
        // ⚠️ Aqui o token pode ainda não estar disponível após login
        if (res?.authenticated) {
          console.warn('[GuestGuard] Usuário já autenticado. Redirecionando...');
          // Redireciona e retorna true para não quebrar o fluxo
          this.router.navigateByUrl('/manage-games');
          return false;
        }

        return true;
      }),
      catchError((err) => {
        // Em erro, presume que não está autenticado
        console.warn('[GuestGuard] Erro no getProfile. Permitindo acesso:', err);
        return of(true);
      })
    );
  }
}
