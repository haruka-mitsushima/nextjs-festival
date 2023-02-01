import axios from 'axios';
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
      await axios.get(
        `http://localhost:3005/api/cart/deleteCart/${cartId}`
      );
      await axios
        .get(`http://localhost:3005/api/user/selectCart/${id}`)
        .then((res) => rebuild(res.data.cart));
    } else {
      // ログイン前の場合
      const body = { id: itemId };

      await axios
        .post(`/api/itemDelete`, body)
        .then((res) => rebuild(res.data.cart))
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
