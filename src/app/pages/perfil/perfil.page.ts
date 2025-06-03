import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user$!: Observable<any>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.user$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return from(getDoc(userDocRef)).pipe(
          map(docSnap => {
            if (docSnap.exists()) {
              return { ...docSnap.data(), email: user.email, uid: user.uid };
            }
            return { email: user.email, uid: user.uid, name: 'Usuário' };
          })
        );
      })
    );
  }

  async copiarUID(uid: string) {
    await Clipboard.write({ string: uid });
    const toast = await this.toastCtrl.create({
      message: 'UID copiado para a área de transferência!',
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair',
      message: 'Tem certeza que deseja sair?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          handler: async () => {
            await signOut(this.auth);
            this.router.navigate(['/login'], { replaceUrl: true });
          },
        },
      ],
    });

    await alert.present();
  }

  voltar() {
    this.router.navigate(['/contatos']);
  }
}
