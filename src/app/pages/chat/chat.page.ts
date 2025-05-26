import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';  // <-- Importa Router
import { IonicModule } from '@ionic/angular';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  CollectionReference,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';

import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Message {
  id?: string;
  text: string;
  timestamp: any;
  senderId: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  contactId!: string;
  contactName!: string;
  userId!: string;

  messages$!: Observable<Message[]>;
  private messagesRef!: CollectionReference;

  newMessage = '';

  editingMessageId: string | null = null;
  editedText: string = '';

  // Injeta o Router no construtor
  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router  // <--- Adicionado aqui
  ) {}

  ngOnInit() {
    this.contactId = this.route.snapshot.paramMap.get('id')!;
    this.contactName = this.route.snapshot.queryParamMap.get('name')!;

    authState(this.auth).subscribe(user => {
      if (user) {
        this.userId = user.uid;

        const chatId = this.getChatId(this.userId, this.contactId);

        this.messagesRef = collection(
          this.firestore,
          `chats/${chatId}/messages`
        );

        this.messages$ = collectionData(
          query(this.messagesRef, orderBy('timestamp', 'asc')),
          { idField: 'id' }
        ) as Observable<Message[]>;
      }
    });
  }

  // Método para voltar para contatos
  goBack() {
    this.router.navigate(['/contatos']);
  }

  async sendMessage() {
    const text = this.newMessage.trim();
    if (!text) return;

    await addDoc(this.messagesRef, {
      text,
      timestamp: serverTimestamp(),
      senderId: this.userId,
    });

    this.newMessage = '';
  }

  private getChatId(uid1: string, uid2: string): string {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  }

  startEdit(message: Message) {
    this.editingMessageId = message.id!;
    this.editedText = message.text;
  }

  async saveEdit() {
    if (!this.editingMessageId) return;

    const docRef = doc(
      this.firestore,
      `chats/${this.getChatId(this.userId, this.contactId)}/messages`,
      this.editingMessageId
    );

    await updateDoc(docRef, {
      text: this.editedText,
    });

    this.editingMessageId = null;
    this.editedText = '';
  }

  cancelEdit() {
    this.editingMessageId = null;
    this.editedText = '';
  }

  async deleteMessage(messageId: string) {
    const docRef = doc(
      this.firestore,
      `chats/${this.getChatId(this.userId, this.contactId)}/messages`,
      messageId
    );
    await deleteDoc(docRef);
  }
}
