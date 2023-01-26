import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserCart, RentalHistory } from '../../types/user';

export default withIronSessionApiRoute(getUserRoute, ironOptions);

export type SessionUser = {
  userId?: number;
  userName?: string;
  userCarts?: UserCart[];
  userRentalHistories?: RentalHistory[];
  favoriteGenre?: number;
  isLoggedIn: boolean;
};

async function getUserRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.user) {
    const userId = req.session.user.userId;
    const url = `http://localhost:3005/api/user/selectCart/${userId}`;
    const response = await fetch(url);
    const result = await response.json();
    // const result = await prisma.user.findUnique({
    //   where: {
    //     userId: userId,
    //   },
    //   select: {
    //     Cart: {
    //       include: {
    //         Item: true,
    //       },
    //     },
    //   },
    // });
    res.json({
      userId: userId,
      isLoggedIn: true,
      userCarts: result?.cart,
    });
  } else {
    const sessionCart = req.session.cart;
    if (!sessionCart) {
      res.json({
        isLoggedIn: false,
      });
    } else {
      res.json({
        userCarts: sessionCart,
        isLoggedIn: false,
      });
    }
  }
}
