import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  contacts = [
    { id: '1', name: 'Ana Silva' },
    { id: '2', name: 'Carlos Souza' },
    { id: '3', name: 'Mariana Lima' },
  ];

  constructor(private router: Router) {}

  openChat(contactId: string) {
    this.router.navigate(['/chat', contactId]);
  }
}
