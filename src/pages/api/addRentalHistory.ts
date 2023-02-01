import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart } from '../../types/user';
import axios from 'axios';

export default withIronSessionApiRoute(getUserRoute, ironOptions);

async function getUserRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    // セッションからユーザIDの取得
    const userId = req.session.user.userId;

    // ユーザ情報に紐づくカートの取得
    const url = `http://localhost:3005/api/user/selectCart/${userId}`;
    const response = await axios.get(url);
    const result = await response.data;
    // const result = await prisma.user.findUnique({
    //   where: {
    //     userId: userId
    //   },
    //   select: {
    //     carts: {
    //       include: {
    //         items: true,
    //       },
    //     },
    //   },
    // })
    if (result.errorFlg) {
      return res.redirect('/error');
    }

    // レンタル履歴追加用のデータを作成
    const carts: UserCart[] = result.cart;
    const addItem = carts.map((item) => {
      let tempItem = {
        userId: userId,
        itemId: item.itemId,
        itemName: `${item.item.artist} ${item.item.fesName}`,
        itemImage: item.item.itemImage,
        price: 0,
        rentalPeriod: item.rentalPeriod,
        // payDate: time,
      };
      if (item.rentalPeriod === 2) {
        tempItem.price = item.item.twoDaysPrice;
      } else {
        tempItem.price = item.item.sevenDaysPrice;
      }
      return tempItem;
    })

    // レンタル履歴テーブルとカートテーブルを同時更新
    const body = { addItem };
    const path = `http://localhost:3005/api/payment/addRentalHistory/${userId}`;
    // const params = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // };
    await axios.post(path, body).catch(() => res.redirect('/error'))
    // const tran = await prisma.$transaction([
    //   // レンタル履歴に追加
    //   prisma.rentalHistory.createMany({
    //     data: addItem
    //   }),
    //   // カート情報を削除
    //   prisma.cart.deleteMany({
    //     where: {
    //       userId: userId
    //     }
    //   })
    //   // 失敗したらエラー画面へ
    // ]).catch(() => res.redirect('/error'));
    res.redirect('/paymentComp').end();
  }
}
