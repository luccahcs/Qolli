import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
})
export class ContatosPage {
  contacts = [
    { id: '1', name: 'Ana Silva' },
    { id: '2', name: 'Carlos Souza' },
    { id: '3', name: 'Mariana Lima' },
  ];

  constructor(private router: Router) {}

  openChat(contactId: string) {
    this.router.navigate(['/chat', contactId]);
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }
}
