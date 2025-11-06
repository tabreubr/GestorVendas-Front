import { ItemVenda } from "./item-venda.model";

export interface Venda {
  id?: number;
  dataHora: string;
  itens: ItemVenda[];
  total?: number;
  expandido?: boolean;
}
