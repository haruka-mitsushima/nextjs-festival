import styles from 'styles/cart.module.css';
import { UserCart } from 'types/user';

export default function DeleteBtn({
  id,
  cartId,
  itemId,
  rebuild,
}: {
  id: number | undefined;
  cartId: number;
  itemId: number;
  rebuild: (cart: UserCart[]) => void;
}) {
  const handleDelte = async () => {
    if (id !== undefined) {
      // ログイン後の場合
      // deleteCartに飛ばす
      await fetch(
        `http://localhost:3005/api/cart/deleteCart/${cartId}`
      );
      await fetch(
        `http://localhost:3005/api/user/selectCart/${id}`
      ).then((res) =>
        res.json().then((result) => {
          rebuild(result.cart);
        })
      );
    } else {
      // ログイン前の場合
      const body = { id: itemId };

      await fetch(`/api/itemDelete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((result) => {
          rebuild(result.cart);
        })
        .catch((error) => {
          console.log('Error', error);
        });
    }
  };
  return (
    <div className={styles.cartBeforeBtnWrapper}>
      <button
        className={styles.cartBeforeBtn}
        onClick={() => handleDelte()}
      >
        削除
      </button>
    </div>
  );
}
