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
  getDoc,
  CollectionReference
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';

import { Observable, of, switchMap } from 'rxjs';

interface Contact {
  id: string;
  name: string;
  uid: string;
}

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
})
export class ContatosPage implements OnInit {
  contacts$!: Observable<Contact[]>;
  private contactsRef!: CollectionReference;
  private currentUserId: string = '';

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
        if (!user) return of([]);
        this.currentUserId = user.uid;
        this.contactsRef = collection(this.firestore, `users/${user.uid}/contacts`);
        return collectionData(this.contactsRef, { idField: 'id' }) as Observable<Contact[]>;
      })
    );
  }

  openChat(contactUid: string, contactName: string) {
    this.router.navigate(['/chat', contactUid], {
      queryParams: { name: contactName }
    });
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }

  async addContact() {
    const alert = await this.alertCtrl.create({
      header: 'Adicionar Contato',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome do contato' },
        { name: 'uid', type: 'text', placeholder: 'UID do contato' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Adicionar',
          handler: async (data): Promise<boolean> => {
            const name = data.name?.trim();
            const uid = data.uid?.trim();

            if (name && uid) {
              // Verifica se o usuário com esse UID existe
              const userDocRef = doc(this.firestore, `users/${uid}`);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                // Se existe, adiciona o contato
                await addDoc(this.contactsRef, { name, uid });
                this.showToast('Contato adicionado!');
                return true; // Fecha o alert
              } else {
                this.showToast('UID não encontrado. Verifique e tente novamente.');
                return false; // Mantém o alert aberto para correção
              }
            } else {
              this.showToast('Preencha todos os campos.');
              return false; // Mantém o alert aberto para correção
            }
          }
        }
      ]
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
          }
        }
      ]
    });
    await alert.present();
  }

  async openProfile() {
    this.router.navigate(['/perfil']);
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  }
}
