import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { VendaService } from '../../services/venda.service';
import { Produto } from '../../models/produto.model';
import { Venda } from '../../models/venda.model';
import { ItemVenda } from '../../models/item-venda.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  encapsulation: ViewEncapsulation.None
})
export class Dashboard implements OnInit {

  produtos: Produto[] = [];
  vendas: Venda[] = [];

  produtosLimit: Produto[] = [];
  vendasLimit: Venda[] = [];
  produtosExibidos: number = 10;
  vendasExibidos: number = 10;

  novoProduto: Produto = { nome: '', descricao: '', quantidade: 0, preco: 0};

  itensVenda: ItemVenda[] = [];
  itemTemp: ItemVenda = { produto: { id: 0, nome: '', descricao: '', quantidade: 0, preco: 0}, quantidade: 1 };

  constructor(private produtoService: ProdutoService, private vendaService: VendaService) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarVendas();
  }

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: data => {
        this.produtos = data || [];
        this.produtosLimit = this.produtos.slice(0, this.produtosExibidos);
      },
      error: err => console.error('Erro ao carregar produtos', err)
    });
  }

  carregarVendas(): void {
    this.vendaService.getVendas().subscribe({
      next: data => {
        this.vendas = data || [];
        this.vendasLimit = this.vendas.slice(-this.vendasExibidos);
      },
      error: err => console.error('Erro ao carregar vendas', err)
    });
  }

  adicionarProduto(): void {
    this.produtoService.salvarProduto(this.novoProduto).subscribe({
      next: () => {
        this.novoProduto = { nome: '', descricao: '', quantidade: 0, preco: 0};
        this.carregarProdutos();
      },
      error: err => console.error('Erro ao salvar produto', err)
    });
  }

  adicionarItemVenda(): void {
    if (!this.itemTemp.produto || this.itemTemp.quantidade <= 0) return;
    this.itensVenda.push({ ...this.itemTemp });
    this.itemTemp = { produto: { id: 0, nome: '', descricao: '', quantidade: 0, preco: 0}, quantidade: 1 };
  }

  removerItemVenda(index: number): void {
    this.itensVenda.splice(index, 1);
  }

  atualizarQuantidade(index: number, novaQtd: number): void {
    if (novaQtd <= 0) {
      this.removerItemVenda(index);
    } else {
      this.itensVenda[index].quantidade = novaQtd;
    }
  }

  registrarVenda(): void {
    if (!this.itensVenda.length) return;

    const venda: Venda = {
      dataHora: new Date().toISOString(),
      itens: this.itensVenda
    };

    this.vendaService.registrarVenda(venda).subscribe({
      next: () => {
        this.itensVenda = [];
        this.carregarVendas();
      },
      error: err => console.error('Erro ao registrar venda', err)
    });
  }

  getTotalVenda(): number {
    return this.itensVenda.reduce((total, item) => {
      const preco = item.produto?.preco || 0;
      return total + preco * (item.quantidade || 0);
    }, 0);
  }

  maisVendido(): { produtoNome: string; quantidade: number } | null {
    if (!this.vendas?.length) return null;
    const map = new Map<string, number>();
    this.vendas.forEach(v => {
      v.itens?.forEach(i => {
        const nome = i.produto?.nome || '';
        if (!nome) return;
        map.set(nome, (map.get(nome) || 0) + (i.quantidade || 0));
      });
    });
    let maxProduto = '', maxQtd = 0;
    map.forEach((qtd, nome) => {
      if (qtd > maxQtd) {
        maxQtd = qtd;
        maxProduto = nome;
      }
    });
    return { produtoNome: maxProduto, quantidade: maxQtd };
  }

  // Botões ver mais / limpar
  verMaisProdutos(): void { this.produtosLimit = this.produtos; }
  verMaisVendas(): void { this.vendasLimit = this.vendas; }
  limparProdutosExibidos(): void { this.produtosLimit = []; }
  limparVendasExibidas(): void { this.vendasLimit = []; }

}
