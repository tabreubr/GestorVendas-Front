import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProdutoFormComponent } from './components/produto-form/produto-form';
import { VendaFormComponent } from './components/venda-form/venda-form';
import { LoginComponent } from './components/login/login-form';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout';

export const routes: Routes = [
  // 🔓 Rota pública — Login sem sidebar
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 🔒 Rotas privadas — dentro do layout com sidebar
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produtos', component: ProdutoFormComponent },
      { path: 'vendas', component: VendaFormComponent },
    ],
  },

  // fallback
  { path: '**', redirectTo: 'login' },
];
