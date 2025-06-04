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
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { Auth, authState } from '@angular/fire/auth';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Message {
  id?: string;
  fromId: string;
  toId: string;
  text: string;
  timestamp: number;
  conversationKey: string;
  deletedFor?: string[];
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
  conversationKey!: string;

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
      this.tryLoadConversation();
    });

    this.route.queryParams.subscribe(params => {
      this.contactName = params['name'] || '';
    });

    authState(this.auth).subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.tryLoadConversation();
      }
    });
  }

  async tryLoadConversation() {
    if (this.currentUserId && this.contactUid) {
      this.conversationKey = this.generateConversationKey(
        this.currentUserId,
        this.contactUid
      );
      this.loadMessages();

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

  generateConversationKey(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join('-');
  }

  loadMessages() {
    const messagesRef = collection(
      this.firestore,
      `conversations/${this.conversationKey}/messages`
    );

    const q = query(messagesRef, orderBy('timestamp'));

    this.messages$ = collectionData(q, { idField: 'id' }).pipe(
      map((messages: any[]) =>
        messages.filter(
          (msg) => !(msg.deletedFor || []).includes(this.currentUserId)
        )
      )
    ) as Observable<Message[]>;
  }

  async sendMessage() {
    const text = this.messageText.trim();
    if (!text) return;

    const messagesRef = collection(
      this.firestore,
      `conversations/${this.conversationKey}/messages`
    );

    await addDoc(messagesRef, {
      conversationKey: this.conversationKey,
      fromId: this.currentUserId,
      toId: this.contactUid,
      text,
      timestamp: new Date(),
      deletedFor: [], // ✅ Corrigido aqui
    });

    this.messageText = '';
  }

  isMyMessage(msg: Message): boolean {
    return msg.fromId === this.currentUserId;
  }

  voltar() {
    this.router.navigate(['/contatos']);
  }

  async confirmDelete(msg: Message) {
    const alert = await this.alertCtrl.create({
      header: 'Apagar mensagem',
      message: 'Tem certeza que deseja apagar esta mensagem?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Apagar',
          role: 'destructive',
          handler: () => {
            this.deleteMessage(msg);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteMessage(msg: Message) {
    const msgRef = doc(
      this.firestore,
      `conversations/${this.conversationKey}/messages/${msg.id}`
    );

    const alreadyDeletedFor = msg.deletedFor || [];

    if (alreadyDeletedFor.includes(this.currentUserId)) return;

    const updatedDeletedFor = [...alreadyDeletedFor, this.currentUserId];

    if (
      updatedDeletedFor.includes(this.currentUserId) &&
      updatedDeletedFor.includes(this.contactUid)
    ) {
      await deleteDoc(msgRef);
    } else {
      await updateDoc(msgRef, {
        deletedFor: updatedDeletedFor,
      });
    }
  }
  goToProfile() {
  // Navigate to the profile page of the contact user by their UID
  this.router.navigate(['/perfil', this.contactUid]);
}
}


