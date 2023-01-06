import styles from 'styles/review.module.css';
import useSWR from 'swr';
import loadStyles from 'styles/loading.module.css';
import { Reviews } from 'types/review';
import { use, useState } from 'react';
import ReviewSelect from './ReviewSort ';
import Pagination from './Paging';
import { NextApiRequest, NextApiResponse } from 'next';
import { Item } from 'types/item';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Review = {
  reviewId: number;
  itemId: number;
  userId: number;
  postTime: string;
  reviewTitle: string;
  reviewText: string;
  evaluation: number;
  spoiler: boolean;
  items: Item;
};

export default function Review({ itemId }: { itemId: number }) {
  const [orderBy, setOrderBy] = useState('reviewId');
  const [order, setOrder] = useState('desc');
  // 選択されたページの1番目の番号
  const [itemOffset, setItemOffSet] = useState(0);

  const { data } = useSWR(
    `/api/selectReview/${itemId}/${orderBy}/${order}`,
    fetcher
  );

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

  const reviews = data.data;
  const total = data.count;

  // レーティング機能
  // 点数の配列のみ取り出す
  let scoreArr = reviews.map((dataList: Review) => {
    return dataList.evaluation;
  });

  let sum = 0;
  //平均点を求める
  if (!scoreArr.length) {
    sum = 0;
  } else {
    sum = scoreArr.reduce((pre: number, curr: number) => pre + curr);
  }

  // 平均点に１０をかけ、小数点を切り捨てた後１０で割ると小数点一桁のみ表示可能
  let average = Math.floor((sum / scoreArr.length) * 10) / 10;

  // 平均点を四捨五入
  let rate = Math.round(average * 2) / 2;

  if (!average) {
    average = 0;
    rate = 0;
  }

  // ページネーション機能
  // １ページにつき表示する件数
  const itemPerPage = 5;

  // ページの終わりの番号
  const endOffset = itemOffset + itemPerPage;

  const currentReviews = reviews.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(total / itemPerPage);

  // 余りが選択されたページ番号の1番目番号になる
  const handleClick = (i: number) => {
    let num = i - 1;
    const newOffset = (num * itemPerPage) % total;
    setItemOffSet(newOffset);
  };

  // 動的APIルーティングの値を変更
  const selectChange = (value: string) => {
    const result = value.split(',');
    setOrderBy(result[0]);
    setOrder(result[1]);
  };

  return (
    <>
      <section className={styles.accordionWrapper}>
        <h1 className={styles.title}>レビュー</h1>
        <p className={styles.score}>総合{average}点</p>
        <p className={styles.star}>
          <span className={styles.rating} data-rate={rate}></span>
        </p>
        <div className={styles.accordionOuter}>
          <ReviewSelect selectChange={selectChange} />
          {currentReviews.map((review: Review) => {
            return (
              <div key={review.reviewId} className={styles.accordion}>
                <input
                  type="checkbox"
                  className={styles.toggle}
                  id={String(review.reviewId)}
                />
                <label
                  className={styles.label}
                  htmlFor={String(review.reviewId)}
                >
                  {review.reviewTitle}
                  {review.spoiler && (
                    <span className={styles.tag}>ネタバレあり </span>
                  )}
                </label>
                <div className={styles.contentBody}>
                  {/* <p>投稿者名：{review.}</p> */}
                  {/* userNameはどう取得する？ */}
                  <p>投稿日：{review.postTime}</p>
                  <p>点数：{review.evaluation}点</p>
                  <p>{review.reviewText}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {(function () {
        const list = [];
        for (let i = 1; i <= pageCount; i++) {
          list.push(
            <button
              key={i}
              className={styles.pagingBtn}
              onClick={() => handleClick(i)}
            >
              {i}
            </button>
          );
        }
        return (
          <div className={`${styles.paging} ${styles.taLeft}`}>
            {list}
          </div>
        );
      })()}
      <style jsx>
        {`
          p {
            margin-block-start: 0;
            margin-block-end: 0;
          }
        `}
      </style>
    </>
  );
}
