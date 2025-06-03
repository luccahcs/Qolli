import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  template: `
    <ion-content class="ion-padding ion-text-center">
      <ion-spinner name="crescent"></ion-spinner>
      <p>Carregando...</p>
    </ion-content>
  `,
})
export class SplashPage implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.router.navigate(['/contatos'], { replaceUrl: true });
      } else {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }
}
