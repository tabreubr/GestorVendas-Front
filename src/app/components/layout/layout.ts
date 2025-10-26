import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  imports: [RouterOutlet],
})
export class LayoutComponent {

  constructor(private authService: AuthService, public router: Router) {}

  logout() {
    this.authService.logout(); // método no AuthService que limpa login
    this.router.navigate(['/login']);
  }

   isActive(url: string) {
    return this.router.isActive(url, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }
}
