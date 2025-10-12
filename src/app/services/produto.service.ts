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

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }
}