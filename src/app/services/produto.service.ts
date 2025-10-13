import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/produtos';
  
  constructor(private http: HttpClient) { }

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  adicionar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto);
  }

  atualizar(id: number, produto: Produto): Observable<Produto> {
  return this.http.put<Produto>(`${this.baseUrl}/${id}`, produto);
}

  // Reposição de estoque
reporEstoque(reposicao: { produto: number; quantidade: number }): Observable<any> {
  return this.http.put(`${this.baseUrl}/repor`, reposicao);
}

// Remover produto
remover(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${id}`);
}

  consultarPorNome(nome: string): Observable<Produto[]> {
  return this.http.get<Produto[]>(`${this.baseUrl}?nome=${nome}`);
}

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }
}
