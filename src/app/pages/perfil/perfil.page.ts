import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
  userId!: string;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  const paramUserId = this.route.snapshot.paramMap.get('id');

  if (paramUserId) {
    // Load other user's profile and assign observable to user$
    this.userId = paramUserId;
    this.user$ = this.loadUserProfile(this.userId);
  } else {
    // Load current logged-in user's profile
    this.user$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          // Redirect if not logged in
          this.router.navigate(['/login'], { replaceUrl: true });
          return of(null);
        }
        this.userId = user.uid;
        return this.loadUserProfile(this.userId);
      })
    );
  }
}

  loadUserProfile(userId: string): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return { ...docSnap.data(), uid: userId };
        }
        return { uid: userId, name: 'Usuário Desconhecido' };
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