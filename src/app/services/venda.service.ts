import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venda } from '../models/venda.model';

@Injectable({ providedIn: 'root' })
export class VendaService {
  private baseUrl = 'http://localhost:8080/vendas';

    constructor(private http: HttpClient) {}

  listar(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.baseUrl);
  }

  registrar(itens: { produtoId: number; quantidade: number }[]): Observable<Venda> {
    return this.http.post<Venda>(this.baseUrl, { itens });
  }
}