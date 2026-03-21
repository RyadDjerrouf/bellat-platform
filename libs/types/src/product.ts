import { StockStatus } from './enums';

export interface ProductSummary {
  id:          string;
  nameFr:      string;
  nameAr:      string;
  price:       number;
  unit:        string;
  stockStatus: StockStatus;
  imageUrl:    string | null;
  categoryId:  string;
}
