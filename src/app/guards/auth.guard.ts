import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service'; // ajuste se o caminho for diferente

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isLoggedIn = !!this.auth.getCurrentUser(); // ou outra lógica que você use
    return isLoggedIn ? true : this.router.createUrlTree(['/login']);
  }
}
