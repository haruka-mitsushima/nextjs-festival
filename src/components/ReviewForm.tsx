import reviewStyles from 'styles/review.module.css';
import { Item } from 'types/item';
import { useRef, Dispatch, SetStateAction, MouseEvent } from 'react';

type Reviews = {
  item?: Item;
  formReviewTitle: string;
  formReviewText: string;
  formEvaluation: number;
  formSpoiler: boolean;
  setFormReviewTitle: Dispatch<SetStateAction<string>>;
  setFormReviewText: Dispatch<SetStateAction<string>>;
  setFormEvaluation: Dispatch<SetStateAction<number>>;
  setFormSpoiler: Dispatch<SetStateAction<boolean>>;
};

export default function ReviewForm(props: Reviews) {
  const review = useRef<HTMLDivElement>(null);

  //星を押した時
  const handleClick = function (e: MouseEvent<HTMLSpanElement>) {
    props.setFormEvaluation(Number((e.target as Element).id));

    for (let i = 0; i < 5; i++) {
      review.current?.children[i].classList.remove(
        `${reviewStyles.active}`
      );
    }

    for (let i = 0; i < Number((e.target as Element).id); i++) {
      review.current?.children[i].classList.add(
        `${reviewStyles.active}`
      );
    }
  };

  return (
    <div>
      <div ref={review}>
        <span
          className={reviewStyles.evaluation}
          id="1"
          onClick={(e) => handleClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="2"
          onClick={(e) => handleClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="3"
          onClick={(e) => handleClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="4"
          onClick={(e) => handleClick(e)}
        >
          ★
        </span>
        <span
          className={reviewStyles.evaluation}
          id="5"
          onClick={(e) => handleClick(e)}
        >
          ★
        </span>
      </div>

      <div>
        <label>レビュータイトル</label>
      </div>
      <input
        type="text"
        name="reviewName"
        id="reviewName"
        value={props.formReviewTitle}
        onChange={(e) => props.setFormReviewTitle(e.target.value)}
      />

      <ul>
        <p>ネタバレ</p>
        <li key={1}>
          <input
            name="spoiler"
            id="1"
            type="radio"
            value={1}
            onChange={(e) => props.setFormSpoiler(true)}
          />
          <label htmlFor="1">あり</label>
        </li>
        <li key={2}>
          <input
            name="spoiler"
            id="2"
            type="radio"
            value={2}
            onChange={(e) => props.setFormSpoiler(false)}
          />
          <label htmlFor="2">なし</label>
        </li>
      </ul>

      <div>
        <label>レビュー追加</label>
      </div>
      <input
        type="text"
        name="reviewText"
        id="reviewText"
        value={props.formReviewText}
        onChange={(e) => props.setFormReviewText(e.target.value)}
      />
    </div>
  );
}
