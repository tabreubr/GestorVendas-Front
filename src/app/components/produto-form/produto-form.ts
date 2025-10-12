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
  produto: Omit<Produto, 'id'> = { nome: '', descricao: '', quantidade: 0, preco: 0 };
  produtos: Produto[] = [];
  sucesso: boolean = false;
  erro: string = '';

  constructor(private produtoService: ProdutoService) {
    this.carregarProdutos();
  }

  adicionarProduto() {
    this.produtoService.adicionar(this.produto).subscribe({
      next: (p) => {
        this.produtos.push(p);
        this.sucesso = true;
        this.produto = { nome: '', descricao: '', quantidade: 0, preco: 0 };
      },
      error: (err) => (this.erro = 'Erro ao adicionar produto: ' + err.message),
    });
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe({
      next: (lista) => this.produtos = lista,
      error: (err) => this.erro = 'Erro ao carregar produtos: ' + err.message
    });
  }
}
