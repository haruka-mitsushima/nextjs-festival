import styles from 'styles/review.module.css';

export default function ReviewSelect({
  selectChange,
}: {
  selectChange: (value: string) => void;
}) {
  const handleChange = (value: string) => {
    selectChange(value);
  };

  return (
    <>
      <form className={styles.selection}>
        <select onChange={(e) => handleChange(e.target.value)}>
          <option value="reviewId,desc">新着順</option>
          <option value="evaluation,desc">評価の高い順</option>
          <option value="evaluation,asc">評価の低い順</option>
        </select>
      </form>
    </>
  );
}
