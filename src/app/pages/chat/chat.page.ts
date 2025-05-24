import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  contactId = '';
  contactName = '';
  message = '';
  messages: { text: string; fromMe: boolean }[] = [];

  contacts = [
    { id: '1', name: 'Ana Silva' },
    { id: '2', name: 'Carlos Souza' },
    { id: '3', name: 'Mariana Lima' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.contactId = this.route.snapshot.paramMap.get('id') || '';
    const contact = this.contacts.find(c => c.id === this.contactId);
    this.contactName = contact ? contact.name : 'Desconhecido';
  }

  sendMessage() {
    if (this.message.trim() === '') return;

    // Mensagem do usuário
    this.messages.push({ text: this.message, fromMe: true });

    // Limpa input
    this.message = '';

    // Resposta automática simulada
    setTimeout(() => {
      this.messages.push({ text: 'Ok!', fromMe: false });
    }, 500);
  }

  goBack() {
    this.router.navigate(['/contatos']);
  }
}
