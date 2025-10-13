import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.css'],
})
export class ProdutoFormComponent {
  // ================= Lista de Produtos =================
  produtos: Produto[] = [];
  erro: string = '';
  sucesso: boolean = false;

  // ================= Modal Adicionar =================
  modalAdicionar: boolean = false;
  novoProduto: Omit<Produto, 'id'> = { nome: '', descricao: '', quantidade: 0, preco: 0 };

  // ================= Pesquisa =================
  filtroNome: string = '';

  // ================= Reposição de Estoque =================
  produtoEmReposicao: Produto | null = null;
  quantidadeReposicao: number = 0;

  // ================= Edição =================
  produtoEmEdicao: Produto | null = null;

  constructor(private produtoService: ProdutoService) {
    this.consultarTodos();
  }

  // ================= Modal Adicionar =================
  abrirModalAdicionar() {
    this.modalAdicionar = true;
    this.sucesso = false;
    this.erro = '';
  }

  fecharModalAdicionar() {
    this.modalAdicionar = false;
    this.novoProduto = { nome: '', descricao: '', quantidade: 0, preco: 0 };
  }

  adicionarProduto() {
    this.produtoService.adicionar(this.novoProduto).subscribe({
      next: (p) => {
        // Adiciona o novo produto na lista automaticamente
        this.produtos.push(p);
        this.sucesso = true;
        this.novoProduto = { nome: '', descricao: '', quantidade: 0, preco: 0 };
        this.fecharModalAdicionar();
      },
      error: (err) => (this.erro = 'Erro ao adicionar produto: ' + err.message),
    });
  }

  // ================= Consultas =================
  consultarTodos() {
    this.produtoService.listar().subscribe({
      next: (lista) => (this.produtos = lista),
      error: (err) => (this.erro = 'Erro ao carregar produtos: ' + err.message),
    });
  }

  consultarPorNome() {
    if (!this.filtroNome.trim()) {
      this.consultarTodos();
      return;
    }
    this.produtoService.consultarPorNome(this.filtroNome).subscribe({
      next: (lista) => (this.produtos = lista),
      error: (err) => (this.erro = 'Erro ao pesquisar produtos: ' + err.message),
    });
  }

  // ================= Reposição de Estoque =================
  abrirReposicaoProduto(produto: Produto) {
    this.produtoEmReposicao = produto;
    this.quantidadeReposicao = 0;
  }

  fecharReposicaoProduto() {
    this.produtoEmReposicao = null;
    this.quantidadeReposicao = 0;
  }

  confirmarReposicaoProduto() {
    if (this.produtoEmReposicao && this.quantidadeReposicao > 0) {
      const payload = {
        produto: this.produtoEmReposicao.id!,
        quantidade: this.quantidadeReposicao,
      };
      this.produtoService.reporEstoque(payload).subscribe({
        next: () => {
          // Atualiza a quantidade localmente para refletir na lista
          const index = this.produtos.findIndex((p) => p.id === this.produtoEmReposicao!.id);
          if (index >= 0) this.produtos[index].quantidade += this.quantidadeReposicao;
          this.fecharReposicaoProduto();
        },
        error: (err) => (this.erro = 'Erro ao repor estoque: ' + err.message),
      });
    }
  }

  // ================= Remover Produto =================
  removerProduto(produto: Produto) {
    if (confirm(`Deseja realmente remover o produto "${produto.nome}"?`)) {
      this.produtoService.remover(produto.id!).subscribe({
        next: () => (this.produtos = this.produtos.filter((p) => p.id !== produto.id)),
        error: (err) => (this.erro = 'Erro ao remover produto: ' + err.message),
      });
    }
  }

  // ================= Edição de Produto =================
  abrirEdicaoProduto(produto: Produto) {
    // Cria uma cópia para edição, evitando alterar a lista antes de salvar
    this.produtoEmEdicao = { ...produto };
  }
  fecharEdicaoProduto() {
    this.produtoEmEdicao = null;
    this.sucesso = false;
    this.erro = '';
  }

  confirmarEdicaoProduto() {
  if (!this.produtoEmEdicao) return;

  this.produtoService.atualizar(this.produtoEmEdicao.id!, this.produtoEmEdicao)
    .subscribe({
      next: (atualizado) => {
        // Cria uma nova array com referência nova
        this.produtos = this.produtos.map(p =>
          p.id === atualizado.id ? { ...atualizado } : p
        );

        // Fecha o modal
        this.fecharEdicaoProduto();
      },
      error: (err) => this.erro = 'Erro ao atualizar produto: ' + err.message
    });
}
}
