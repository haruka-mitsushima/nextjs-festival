import { Item } from './item';

type SessionUserCart = {
  cartId: number;
  itemId: number;
  rentalPeriod: number;
  item: Item;
};

export type { SessionUserCart }
