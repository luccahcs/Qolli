import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.next(user);
    });
  }

  // 🔥 Cadastrar usuário e criar perfil no Firestore
  async register(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Cria documento do perfil no Firestore com o uid do usuário
      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        uid: user.uid,
        email,
        name
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  // 🔑 Login
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // 🚪 Logout
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // ✅ Ver usuário logado
  getCurrentUser() {
    return this.currentUser;
  }
}
