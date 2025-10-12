import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { VendaService } from '../../services/venda.service';
import { Produto } from '../../models/produto.model';
import { Venda } from '../../models/venda.model';
import { ItemVenda } from '../../models/item-venda.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  produtos: Produto[] = [];
  vendas: Venda[] = [];

  totalProdutos: number = 0;
  totalVendas: number = 0;

  produtosRecentes: Produto[] = [];
  vendasRecentes: Venda[] = [];

  constructor(
    private produtoService: ProdutoService,
    private vendaService: VendaService
  ) {}

  ngOnInit(): void {
    // Produtos
    this.produtoService.listar().subscribe((res) => {
      this.produtos = res;
      this.totalProdutos = res.length;
      this.produtosRecentes = res.slice(-5).reverse(); // últimos 5 produtos
    });

    // Vendas
    this.vendaService.listar().subscribe((res) => {
      this.vendas = res;
      this.totalVendas = res.length;
      this.vendasRecentes = res.slice(-5).reverse(); // últimas 5 vendas
    });
  }

  calcularTotalVenda(venda: Venda): number {
    return venda.itens.reduce((acc: number, i: ItemVenda) => acc + i.produto.preco * i.quantidade, 0);
  }
}