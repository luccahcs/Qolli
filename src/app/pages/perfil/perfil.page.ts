import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, NgIf],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.user$ = authState(this.auth);
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair',
      message: 'Deseja realmente sair da sua conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          handler: async () => {
            await signOut(this.auth);
            this.router.navigate(['/login']);
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
