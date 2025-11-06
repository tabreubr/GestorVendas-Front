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
  vendasRecentes: any[] = [];

  constructor(
    private produtoService: ProdutoService,
    private vendaService: VendaService
  ) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe((res) => {
      this.produtos = res;
      this.totalProdutos = res.length;
      this.produtosRecentes = res.slice(-5).reverse();
    });

    this.vendaService.listar().subscribe((res) => {
      this.vendas = res.map((v: any) => this.criarVendaIndependente(v));
      this.totalVendas = res.length;
      this.vendasRecentes = this.vendas.slice(-5).reverse();
    });
  }

  private criarVendaIndependente(venda: any): any {
  return {
    ...venda,
    expandido: false,
    // Se a venda tem itens, cria cópias independentes
    itens: venda.itens ? venda.itens.map((item: any) => ({
      ...item,
      // Garante que usamos os dados snapshot da venda, não do produto atual
      nomeProduto: item.nomeProduto || item.produto?.nome,
      precoUnitario: item.precoUnitario || item.produto?.preco,
      total: item.total || (item.quantidade * (item.precoUnitario || item.produto?.preco))
    })) : []
  };
}

  toggleDetalhes(venda: any): void {
    venda.expandido = !venda.expandido;
  }
}