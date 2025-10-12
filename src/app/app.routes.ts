import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProdutoFormComponent } from './components/produto-form/produto-form';
import { VendaFormComponent } from './components/venda-form/venda-form';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'produtos', component: ProdutoFormComponent },
  { path: 'vendas', component: VendaFormComponent }
];
