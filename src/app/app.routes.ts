import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'contatos',
    loadComponent: () =>
      import('./pages/contatos/contatos.page').then((m) => m.ContatosPage),
    canActivate: [AuthGuard], 
  },
  {
    path: 'chat/:id',
    loadComponent: () =>
      import('./pages/chat/chat.page').then((m) => m.ChatPage),
    canActivate: [AuthGuard], 
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
    canActivate: [AuthGuard], 
  },
];
