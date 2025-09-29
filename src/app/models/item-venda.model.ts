import { Produto } from "./produto.model";

export interface ItemVenda {
  id?: number;
  produto: Produto;
  quantidade: number;
}
