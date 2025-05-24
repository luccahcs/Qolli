import { Routes } from '@angular/router';
import { ContatosPage } from './pages/contatos/contatos.page';
import { ChatPage } from './pages/chat/chat.page';

export const routes: Routes = [
  {
    path: 'contatos',
    component: ContatosPage,
  },
  {
    path: 'chat/:id',
    component: ChatPage,
  },
];
