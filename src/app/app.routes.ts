import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { ChatPage } from './pages/chat/chat.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'chat/:id',
    component: ChatPage,
  },
];
