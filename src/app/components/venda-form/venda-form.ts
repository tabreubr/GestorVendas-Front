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
  styleUrls: ['./venda-form.css']
})
export class VendaFormComponent implements OnInit {
  produtos: Produto[] = [];
  carrinho: ItemVenda[] = [];
  itemSelecionado: ItemVenda = { produto: null as any, quantidade: 1 };
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(
    private produtoService: ProdutoService,
    private vendaService: VendaService
  ) {}

  ngOnInit() {
    this.produtoService.listar().subscribe({
      next: (dados) => (this.produtos = dados),
      error: (err) => (this.mensagemErro = 'Erro ao carregar produtos: ' + err.message),
    });
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
      quantidade: this.itemSelecionado.quantidade
    });

    this.itemSelecionado = { produto: null as any, quantidade: 1 };
    this.mensagemErro = '';
  }

  removerItem(index: number) {
    this.carrinho.splice(index, 1);
  }

  registrarVenda() {
  const vendaPayload = {
    itens: this.carrinho.map(item => ({
      produto: item.produto.id!,  // nome igual ao DTO Java
      quantidade: item.quantidade
    }))
  };

    console.log('Payload enviado para API:', JSON.stringify(vendaPayload, null, 2));


  this.vendaService.registrar(vendaPayload).subscribe({
    next: () => {
      this.mensagemSucesso = 'Venda registrada com sucesso!';
      this.carrinho = [];
      this.mensagemErro = '';
    },
    error: (err) => {
      console.error(err);
      this.mensagemErro = 'Erro ao registrar venda: ' + (err.error?.message || err.message);
    }
  });
}
}
