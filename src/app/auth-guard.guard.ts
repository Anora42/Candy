import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth

import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (user && user.email === 'solucionesgap1@gmail.com') {
          // El usuario está autenticado y es el administrador
          return true;
        } else {
          // Redirige a la página de inicio de sesión u otra vista
          return this.router.createUrlTree(['/home']);
        }
      })
    );
  }
}

