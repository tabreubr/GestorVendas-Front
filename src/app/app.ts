import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .content {
        margin-left: 220px; /* largura da sidebar */
        padding: 20px;
        min-height: 100vh;
        background-color: #f5f5f5;
      }
    `,
  ],
})
export class App {
  title = signal('GestorVendas');
}
