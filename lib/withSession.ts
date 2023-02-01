import * as IronSession from 'iron-session';
import { Item } from 'types/item';

// iron-sessionで『user』と『cart』が使えるようにするための定義
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      userId: number;
      userName: string;
    };

    cart?: {
      cartId: number;
      itemId: number;
      rentalPeriod: number;
      item: Item
    }[];
  }
}
