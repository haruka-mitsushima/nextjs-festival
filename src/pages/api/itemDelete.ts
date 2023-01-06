import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';

export default withIronSessionApiRoute(async (req, res) => {
  const { id } = await req.body;
  const { detail } = await req.body;
  const carts = req.session.cart;

  try {
    if (carts) {
      if (detail) {
        const fil = carts.filter((cartItem) => {
          return cartItem.itemId !== id;
        });
        req.session.cart = fil;
      } else {
        const fil = carts.filter((cartItem) => {
          return cartItem.itemId !== id;
        });
        req.session.cart = fil;
      }
    }
    await req.session.save();
  } catch {
    console.log('エラー');
  }
  res.json({
    cart: req.session.cart,
  });
}, ironOptions);
