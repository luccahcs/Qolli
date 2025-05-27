import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  orderBy,
  doc,
  getDoc,
} from '@angular/fire/firestore';

import { Auth, authState } from '@angular/fire/auth';

import { Observable } from 'rxjs';

interface Message {
  id?: string;
  senderId: string;
  text: string;
  timestamp: any;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  contactUid!: string;
  contactName!: string;
  chatId!: string;

  messages$!: Observable<Message[]>;
  messageText = '';

  currentUserId!: string;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contactUid = params.get('id')!;
      this.tryLoadChat();
    });

    this.route.queryParams.subscribe(params => {
      this.contactName = params['name'] || '';
    });

    authState(this.auth).subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.tryLoadChat();
      }
    });
  }

  async tryLoadChat() {
    if (this.currentUserId && this.contactUid) {
      this.chatId = this.generateChatId(this.currentUserId, this.contactUid);
      this.loadMessages();

      // Se o nome do contato não veio pelos queryParams, tenta buscar no Firestore
      if (!this.contactName) {
        const userDoc = doc(this.firestore, `users/${this.contactUid}`);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const data = userSnap.data() as any;
          this.contactName = data.name || 'Contato';
        } else {
          this.contactName = 'Usuário Desconhecido';
        }
      }
    }
  }

  generateChatId(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join('_');
  }

  loadMessages() {
    const messagesRef = collection(
      this.firestore,
      `chats/${this.chatId}/messages`
    );

    const q = query(messagesRef, orderBy('timestamp'));

    this.messages$ = collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }

  async sendMessage() {
    const text = this.messageText.trim();
    if (!text) return;

    const messagesRef = collection(
      this.firestore,
      `chats/${this.chatId}/messages`
    );

    await addDoc(messagesRef, {
      senderId: this.currentUserId,
      text,
      timestamp: new Date(),
    });

    this.messageText = '';
  }

  isMyMessage(msg: Message): boolean {
    return msg.senderId === this.currentUserId;
  }

  voltar() {
    this.router.navigate(['/contatos']);
  }
}
