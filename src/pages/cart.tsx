import Image from 'next/image';
import Link from 'next/link';
import { UserCart } from 'types/user';
import styles from 'styles/cart.module.css';
import DeleteBtn from '../components/DeleteItem';
import UseSWR, { mutate } from 'swr';
import Header from '../components/Header';
import Head from 'next/head';
import loadStyles from 'styles/loading.module.css';
import { Item } from 'types/item';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '../../lib/ironOprion';
import { GetServerSideProps } from 'next';
import { SessionUserCart } from 'types/session';
import { SelectCart } from './api/preRendering/PreCart';
import { useEffect, useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withIronSessionSsr(async ({ req }) => {
    // ユーザーIDを渡すかitemIdを渡すかの分岐をしてから渡す
    let userId = req.session.user?.userId;
    if (userId) {
      // ログイン後
      const res = await SelectCart(userId);
      if (!res.cart) {
        return {
          redirect: {
            permanent: false,
            destination: '/error',
          },
        };
      }
      return {
        props: {
          cart: res.cart,
        },
      };
    } else {
      // ログイン前
      let cart: SessionUserCart[];
      if (!req.session.cart) {
        cart = [];
      } else {
        cart = req.session.cart;
      }
      return {
        props: { cart },
      };
    }
  }, ironOptions);

export default function CartList({ cart }: { cart: UserCart[] }) {
  const [cartItem, setCartItem] = useState(cart);
  const { data } = UseSWR('/api/getSessionInfo', fetcher);

  const isLoggedIn = data?.isLoggedIn;

  // ユーザーのカート情報を取得
  let carts = data?.userCarts;

  useEffect(() => {
    if (!isLoggedIn) {
      setCartItem(carts);
    }
  }, [isLoggedIn, carts]);

  if (!data)
    return (
      <div className={loadStyles.loadingArea}>
        <div className={loadStyles.bound}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>g</span>
          <span>...</span>
        </div>
      </div>
    );

  // ユーザーのidを取得予定
  const id = data.userId;

  let isCartflg = true;
  if (!cartItem?.length) {
    isCartflg = false;
  }

  // 合計金額の表示
  let sum: number[] = [];
  if (cartItem !== undefined) {
    cartItem.map((item) => {
      if (item.rentalPeriod === 2) {
        sum.push(item.items.twoDaysPrice);
      } else if (item.rentalPeriod === 7) {
        sum.push(item.items.sevenDaysPrice);
      }
    });
  }

  let total;
  if (!sum.length) {
    total = 0;
  } else {
    total = sum.reduce((accu, curr) => accu + curr);
  }
  return (
    <>
      <Head>
        <title>カート</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getSessionInfo')}
      />
      <main className={styles.cart}>
        {cartItem?.map((item: UserCart) => {
          return (
            <div className={styles.cartContent} key={item.itemId}>
              <div className={styles.cartMedia}>
                <div className={styles.cartInner}>
                  <div className={styles.cartBodyWrapper}>
                    <figure className={styles.cartImgWrapper}>
                      <Image
                        className={styles.cartImg}
                        src={item.items.itemImage}
                        width={200}
                        height={112}
                        alt="商品の画像"
                        priority
                      />
                    </figure>
                    <div className={styles.cartBody}>
                      <p className={styles.cartTitle}>
                        {`${item.items.artist}  ${item.items.fesName}`}
                      </p>
                      <p>
                        レンタル期間：
                        {item.rentalPeriod === 2 ? '48時間' : '7泊'}
                      </p>
                      <Link
                        href={`/items/${item.itemId}`}
                        legacyBehavior
                      >
                        <a>詳細ページへ</a>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.cartPriceWrapper}>
                    <p>価格</p>
                    {item.rentalPeriod === 2 ? (
                      <p className={styles.cartPrice}>
                        {item.items.twoDaysPrice}円
                      </p>
                    ) : (
                      <p className={styles.cartPrice}>
                        {item.items.sevenDaysPrice}円
                      </p>
                    )}
                    <DeleteBtn
                      id={id}
                      cartId={item.cartId}
                      itemId={item.itemId}
                      rebuild={(cart) => setCartItem(cart)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!isCartflg && (
          <p className={styles.isCartFlg}>カートの中身はありません</p>
        )}
        <div className={styles.btnWrapper}>
          <div className={styles.totalPrice}>
            <p>合計金額{total}円</p>
          </div>
          {!isCartflg ? (
            <Link href="/search?categories_like=&q=">
              <button
                className={`${styles.cartBtn} ${styles.bgleft}`}
              >
                <span>商品を探す</span>
              </button>
            </Link>
          ) : (
            <>
              {data.isLoggedIn ? (
                <Link href="/payment">
                  <button
                    className={`${styles.cartBtn} ${styles.bgleft}`}
                  >
                    <span>決済へ進む</span>
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <p>※決済に進むにはログインが必要です</p>
                  <button
                    className={`${styles.cartBtn} ${styles.bgleft}`}
                  >
                    <span>ログインしてください</span>
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
        <style jsx>
          {`
            p {
              margin-block-start: 0;
              margin-block-end: 0;
            }
          `}
        </style>
      </main>
    </>
  );
}
