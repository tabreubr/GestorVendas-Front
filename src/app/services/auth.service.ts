import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioAtual = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioAtual.asObservable();

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => this.usuarioAtual.next(user));
  }

  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  get usuarioLogado(): boolean {
    return this.usuarioAtual.value !== null;
  }
}
