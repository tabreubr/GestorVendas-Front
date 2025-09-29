import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venda } from '../models/venda.model';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private baseUrl = 'http://localhost:8080/vendas';

  constructor(private http: HttpClient) { }

  getVendas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.baseUrl);
  }

  registrarVenda(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(`${this.baseUrl}/salvar`, venda);
  }
}