import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { ProdutoList } from './components/produto-list/produto-list';
import { ProdutoForm } from './components/produto-form/produto-form';
import { VendaForm } from './components/venda-form/venda-form';


export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
