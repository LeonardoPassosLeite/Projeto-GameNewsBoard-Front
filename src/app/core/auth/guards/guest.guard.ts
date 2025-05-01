import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getAuthenticatedUserSafe().pipe(
      map(userProfile => {
        if (userProfile?.username) {
          console.warn('[GuestGuard] Usuário já autenticado. Redirecionando para /manage-games...');
          this.router.navigateByUrl('/manage-games');
          return false;
        }
        return true;
      })
    );
  }
}
