import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  CollectionReference,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';

import { Observable, of, switchMap } from 'rxjs';

interface Contact {
  id: string;
  name: string;
}

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule], // 👈 ADICIONADO RouterModule
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
})
export class ContatosPage implements OnInit {
  contacts$!: Observable<Contact[]>;
  private contactsRef!: CollectionReference;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.contacts$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        this.contactsRef = collection(
          this.firestore,
          `users/${user.uid}/contacts`
        );
        return collectionData(this.contactsRef, { idField: 'id' }) as Observable<Contact[]>;
      })
    );
  }

  openChat(contactId: string, contactName: string) {
    this.router.navigate(['/chat', contactId], {
      queryParams: { name: contactName }
    });
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }

  async addContact() {
    const alert = await this.alertCtrl.create({
      header: 'Novo Contato',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Nome do contato' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Adicionar',
          handler: async data => {
            if (data.name?.trim()) {
              await addDoc(this.contactsRef, { name: data.name.trim() });
              this.showToast('Contato adicionado!');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteContact(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Contato',
      message: 'Tem certeza que deseja excluir este contato?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            const docRef = doc(this.firestore, this.contactsRef.path, id);
            await deleteDoc(docRef);
            this.showToast('Contato removido.');
          },
        },
      ],
    });
    await alert.present();
  }

  async openProfile() {
    this.router.navigate(['/perfil']); // 👈 Corrigido aqui
  }

  private async showToast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 1500, position: 'bottom' });
    await t.present();
  }
}
