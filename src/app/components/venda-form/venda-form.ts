import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../models/produto.model';
import { ItemVenda } from '../../models/item-venda.model';
import { Venda } from '../../models/venda.model';
import { ProdutoService } from '../../services/produto.service';
import { VendaService } from '../../services/venda.service';

@Component({
  selector: 'app-venda-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venda-form.html',
  styleUrls: ['./venda-form.css'],
})
export class VendaFormComponent implements OnInit {
  produtos: Produto[] = [];
  carrinho: ItemVenda[] = [];
  itemSelecionado: ItemVenda = { produto: null as any, quantidade: 1 };
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  vendas: Venda[] = [];
  vendasFiltradas: Venda[] = [];
  vendasPaginadas: Venda[] = [];

  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 1;

  filtroNome = '';
  mensagemFiltro: string = '';
  dataInicio?: string;
  dataFim?: string;

  totalGeral: number = 0;

  constructor(private produtoService: ProdutoService, private vendaService: VendaService) {}

  ngOnInit() {
    this.produtoService.listar().subscribe({
      next: (dados) => (this.produtos = dados),
      error: (err) => (this.mensagemErro = 'Erro ao carregar produtos: ' + err.message),
    });

    this.carregarVendas();
  }

  carregarVendas() {
    this.vendaService.listar().subscribe({
      next: (dados) => {
        // Cria cópia independente das vendas e calcula totais
        this.vendas = dados
          .map((v: any) => this.criarVendaIndependente(v))
          // Ordena da mais recente para a mais antiga
          .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

        this.aplicarFiltros();
      },
      error: (err) => {
        console.error(err);
        this.mensagemErro = 'Erro ao carregar vendas: ' + (err.error?.message || err.message);
      },
    });
  }

  criarVendaIndependente(venda: any): Venda {
    const total =
      venda.itens?.reduce((acc: number, i: any) => {
        const preco = i.produto?.preco || 0;
        const qtd = i.quantidade || 0;
        return acc + preco * qtd;
      }, 0) || 0;

    return {
      ...venda,
      total,
      expandido: false,
      itens:
        venda.itens?.map((i: any) => ({
          ...i,
          produto: i.produto || { nome: 'Produto desconhecido', preco: 0 },
        })) || [],
    };
  }

  aplicarFiltros() {
    this.mensagemFiltro = '';
    let filtradas = [...this.vendas];

    // === FILTRO POR NOME ===
    if (this.filtroNome.trim() !== '') {
      const termo = this.filtroNome.toLowerCase();
      filtradas = filtradas.filter((v) =>
        v.itens.some((i) => i.produto?.nome?.toLowerCase().includes(termo))
      );
    }

    // === FILTRO POR DATA ===
    if (this.dataInicio && this.dataFim) {
      const inicio = new Date(this.dataInicio);
      const fim = new Date(this.dataFim);

      if (fim < inicio) {
        this.mensagemFiltro = 'A data final não pode ser menor que a data inicial.';
        this.vendasFiltradas = [];
        this.vendasPaginadas = [];
        this.totalGeral = 0;
        return;
      }

      filtradas = filtradas.filter((v) => {
        const dataVenda = new Date(v.dataHora);
        return dataVenda >= inicio && dataVenda <= fim;
      });
    } else if (this.dataInicio && !this.dataFim) {
      const inicio = new Date(this.dataInicio);
      filtradas = filtradas.filter((v) => new Date(v.dataHora) >= inicio);
    } else if (!this.dataInicio && this.dataFim) {
      const fim = new Date(this.dataFim);
      filtradas = filtradas.filter((v) => new Date(v.dataHora) <= fim);
    }

    // === ORDENA DO MAIS RECENTE PARA O MAIS ANTIGO ===
    filtradas.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

    // === ATUALIZA DADOS FILTRADOS ===
    this.vendasFiltradas = filtradas;
    this.totalPaginas = Math.ceil(filtradas.length / this.itensPorPagina);
    this.paginaAtual = 1;

    this.totalGeral = filtradas.reduce((acc, v) => acc + (v.total || 0), 0);

    this.atualizarPaginacao();
  }

  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.vendasPaginadas = this.vendasFiltradas.slice(inicio, fim);
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  toggleDetalhes(venda: any) {
    venda.expandido = !venda.expandido;
  }

  adicionarItem() {
    if (!this.itemSelecionado.produto) {
      this.mensagemErro = 'Selecione um produto válido.';
      return;
    }

    if (this.itemSelecionado.quantidade > this.itemSelecionado.produto.quantidade) {
      this.mensagemErro = 'Quantidade acima do estoque!';
      return;
    }

    this.carrinho.push({
      produto: this.itemSelecionado.produto,
      quantidade: this.itemSelecionado.quantidade,
    });

    this.itemSelecionado = { produto: null as any, quantidade: 1 };
    this.mensagemErro = '';
  }

  removerItem(index: number) {
    this.carrinho.splice(index, 1);
  }

  registrarVenda() {
    const vendaPayload = {
      itens: this.carrinho.map((item) => ({
        produto: item.produto.id!,
        quantidade: item.quantidade,
      })),
    };

    this.vendaService.registrar(vendaPayload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Venda registrada com sucesso!';
        this.carrinho = [];
        this.mensagemErro = '';

        // 🔹 Recarrega vendas e produtos logo após registrar
        this.carregarVendas();
        this.atualizarProdutos();

        // 🔹 Limpa o sucesso após alguns segundos
        setTimeout(() => {
          this.mensagemSucesso = '';
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.mensagemErro = 'Erro ao registrar venda: ' + (err.error?.message || err.message);
      },
    });
  }
  atualizarProdutos() {
    this.produtoService.listar().subscribe({
      next: (dados) => (this.produtos = dados),
      error: (err) => (this.mensagemErro = 'Erro ao atualizar produtos: ' + err.message),
    });
  }
}
