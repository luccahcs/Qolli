import { Routes } from '@angular/router';
import { ContatosPage } from './pages/contatos/contatos.page';
import { ChatPage } from './pages/chat/chat.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // ✅ Agora inicia no login
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
    component: ContatosPage,
  },
  {
    path: 'chat/:id',
    component: ChatPage,
  },
  
 {
  path: 'perfil',
  loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
},

];
