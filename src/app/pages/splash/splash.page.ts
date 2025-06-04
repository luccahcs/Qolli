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
    <ion-content class="splash-content" [class.fade-out]="fadeOut">
    <div class="splash-center">
      <img src="assets/icon/logo.png" alt="Logo" class="logo" />
      <ion-spinner name="crescent" color="primary"></ion-spinner>
      <p>Carregando...</p>
    </div>
  </ion-content>
  `,
  styles: [`
  .splash-content {
    --background: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 1s ease-in-out;
    opacity: 1;
    padding: 0;
  }

  .splash-content.fade-out {
    opacity: 0;
    pointer-events: none;
  }

  .splash-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    width: 50vw;
    max-width: 250px;
    margin-bottom: 20px;
  }
`],
})

export class SplashPage implements OnInit {
  fadeOut = false;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    // Small delay before checking auth and transitioning
    setTimeout(() => {
      this.fadeOut = true;

      // After fade-out, check auth and route
      setTimeout(() => {
        authState(this.auth).subscribe(user => {
          if (user) {
            this.router.navigate(['/contatos'], { replaceUrl: true });
          } else {
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        });
      }, 1000); // wait for fade-out
    }, 1000); // initial splash time
  }
}