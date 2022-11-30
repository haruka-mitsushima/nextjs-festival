import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from 'styles/register.module.css';
import Link from 'next/link';

type Errors = {
  userName: string;
  zipcode: string;
  prefectures: string;
  city: string;
  houseNumber: string;
  buildingName: string;
  familyName: string;
  firstName: string;
  familyNameKana: string;
  firstNameKana: string;
  phoneNumbe: string;
  mailAddress: string;
  password: string;
  passwordTest: string;
};

export default function LoginScreen() {
  const initialValues = {
    userName: '',
    zipcode: '',
    prefectures: '',
    city: '',
    houseNumber: '',
    buildingName: '',
    familyName: '',
    firstName: '',
    familyNameKana: '',
    firstNameKana: '',
    phoneNumbe: '',
    mailAddress: '',
    password: '',
    passwordTest: '',
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErros, setFormErrors] = useState({
    userName: '',
    zipcode: '',
    prefectures: '',
    city: '',
    houseNumber: '',
    buildingName: '',
    familyName: '',
    firstName: '',
    familyNameKana: '',
    firstNameKana: '',
    phoneNumbe: '',
    mailAddress: '',
    password: '',
    passwordTest: '',
  });
  const rentalHistories: [] = []; ///レンタル履歴
  const userCarts: [] = []; //カートの中身
  const router = useRouter(); //登録された情報を更新した状態でページを移動

  //住所を検索
  const submitAddress = async () => {
    ///住所API
    //住所情報のURLを作成
    let api =
      'https://zipcloud.ibsnet.co.jp/api/search?zipcode=';

    let url = api + formValues.zipcode;
    //住所情報を取得
    const response = await fetch(url, {
      method: 'GET',
    });
    const Address = await response.json();

    // prefectures,city,houseNumberの値を変更
    setFormValues({
      ...formValues,
      prefectures: Address.results[0].address1,
      city: Address.results[0].address2,
      houseNumber: Address.results[0].address3,
    });
  };

  //文字を打った時
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // console.log(formValues);
  };

  //会員登録ボタンを押した時
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const error:Errors = validate(formValues);
    setFormErrors(error);

    if (
      !(
        formValues.userName === '' ||
        formValues.zipcode === '' ||
        formValues.prefectures === '' ||
        formValues.city === '' ||
        formValues.houseNumber === '' ||
        formValues.familyName === '' ||
        formValues.firstName === '' ||
        formValues.familyNameKana === '' ||
        formValues.firstNameKana === '' ||
        formValues.phoneNumbe === '' ||
        formValues.mailAddress === '' ||
        formValues.password === '' ||
        formValues.passwordTest === ''
      )
    ) {
      // 登録内容を登録する
      const response = await fetch('http://localhost:3000/api/users', {
        //Jsonファイルに送る
        method: 'POST',
        body: JSON.stringify({
          //Jsonデータに保存する内容を記載
          userName: formValues.userName,
          zipcode: formValues.zipcode,
          prefectures: formValues.prefectures,
          city: formValues.city,
          houseNumber: formValues.houseNumber,
          buildingName: formValues.buildingName,
          familyName: formValues.familyName,
          firstName: formValues.firstName,
          familyNameKana: formValues.familyNameKana,
          firstNameKana: formValues.firstNameKana,
          mailAddress: formValues.mailAddress,
          password: formValues.password,
          rentalHistories,
          userCarts,
        }),
        headers: {
          'Content-type': 'application/json', //Jsonファイルということを知らせるために行う
        },
      }).then(() => {
        router.push('http://localhost:3000/registerComp'); //e.preventDefault()を行なった為、クライアント側の遷移処理をここで行う
      });
    }
  };

  //入力情報エラー条件
  const validate = (values:Errors) => {
    const errors: Errors = {
      userName: '',
      zipcode: '',
      prefectures: '',
      city: '',
      houseNumber: '',
      buildingName: '',
      familyName: '',
      firstName: '',
      familyNameKana: '',
      firstNameKana: '',
      phoneNumbe: '',
      mailAddress: '',
      password: '',
      passwordTest: '',
    };
    const regex =
      /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))([a-zA-Z0-9!@;:]){8,16}$/;

    if (!formValues.userName) {
      errors.userName = 'ユーザー名を入力してください';
    }
    if (!formValues.zipcode) {
      errors.zipcode = '郵便番号を入力してください';
    }
    if (!formValues.prefectures) {
      errors.prefectures = '都道府県を入力してください';
    }
    if (!formValues.city) {
      errors.city = '市区町村を入力してください';
    }
    if (!formValues.houseNumber) {
      errors.houseNumber = '番地を入力してください';
    }
    if (!formValues.familyName) {
      errors.familyName = '姓を入力してください';
    }
    if (!formValues.firstName) {
      errors.firstName = '名を入力してください';
    }
    if (!formValues.familyNameKana) {
      errors.familyNameKana = 'セイを入力してください';
    }
    if (!formValues.firstNameKana) {
      errors.firstNameKana = 'メイを入力してください';
    }
    if (!formValues.phoneNumbe) {
      errors.phoneNumbe = '電話番号を入力してください';
    }
    if (!formValues.mailAddress) {
      errors.mailAddress = 'メールアドレスを入力してください';
    }
    if (!formValues.password) {
      errors.password = 'パスワードを入力してください';
    } else if (!regex.test(formValues.password)) {
      errors.password =
        '※8文字以上16文字以内。大文字、小文字、数字、記号のうち3種類以上';
    }
    if (!formValues.passwordTest) {
      errors.passwordTest = '確認用パスワードを入力してください';
    }
    return errors;
  };

  return (
    <>
      <h1>お客様の情報登録</h1>
      <form onSubmit={handleSubmit}>
        <span id="alertMessage"></span>
        <ul>
          <li>
            <label>ユーザー名</label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={formValues.userName}
              onChange={(e) => handleChange(e)}
            />
            <p className={styles.error}>{formErros.userName}</p>
          </li>
          <li>
            <label>住所</label>
            <table>
              <tbody>
                <tr>
                  <th>郵便番号</th>
                  <td>
                    <input
                      type="text"
                      name="zipcode"
                      id="zipcode"
                      value={formValues.zipcode}
                      onChange={(e) => handleChange(e)}
                    />
                    <button
                      onClick={submitAddress}
                      type="button"
                      id="btn-search"
                    >
                      住所検索
                    </button>
                    <p className={styles.error}>
                      {formErros.zipcode}
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>都道府県</th>
                  <td>
                    <input
                      type="text"
                      name="prefectures"
                      id="prefectures"
                      value={formValues.prefectures}
                      onChange={(e) => handleChange(e)}
                    />
                    <p className={styles.error}>
                      {formErros.prefectures}
                    </p>
                  </td>
                  <th>市区町村</th>
                  <td>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formValues.city}
                      onChange={(e) => handleChange(e)}
                    />
                    <p className={styles.error}>{formErros.city}</p>
                  </td>
                  <th>番地</th>
                  <td>
                    <input
                      type="text"
                      name="houseNumber"
                      id="houseNumber"
                      value={formValues.houseNumber}
                      onChange={(e) => handleChange(e)}
                    />
                    <p className={styles.error}>
                      {formErros.houseNumber}
                    </p>
                  </td>
                  <th>建物名・部屋番号</th>
                  <td>
                    <input
                      type="text"
                      name="buildingName"
                      id="buildingName"
                      value={formValues.buildingName}
                      onChange={(e) => handleChange(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
          <li>
            <label>姓名</label>
            <input
              type="text"
              name="familyName"
              id="familyName"
              value={formValues.familyName}
              onChange={(e) => handleChange(e)}
            />
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formValues.firstName}
              onChange={(e) => handleChange(e)}
            />
            <p className={styles.error}>{formErros.familyName}</p>
            <p className={styles.error}>{formErros.firstName}</p>
          </li>

          <li>
            <label>セイメイ</label>
            <input
              type="text"
              name="familyNameKana"
              id="familyNameKana"
              value={formValues.familyNameKana}
              onChange={(e) => handleChange(e)}
            />

            <input
              type="text"
              name="firstNameKana"
              id="firstNameKana"
              value={formValues.firstNameKana}
              onChange={(e) => handleChange(e)}
            />
            <p className={styles.error}>{formErros.familyNameKana}</p>
            <p className={styles.error}>{formErros.firstNameKana}</p>
          </li>
          <li>
            <label>電話番号</label>
            <input
              type="tel"
              name="phoneNumbe"
              id="phoneNumbe"
              value={formValues.phoneNumbe}
              onChange={(e) => handleChange(e)}
            />
            <p className={styles.error}>{formErros.phoneNumbe}</p>
          </li>

          <li>
            <label>メールアドレス</label>
            <input
              type="email"
              name="mailAddress"
              id="mailAddress"
              value={formValues.mailAddress}
              onChange={(e) => handleChange(e)}
            />
            <p className={styles.error}>{formErros.mailAddress}</p>
          </li>

          <li>
            <label>パスワード</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={(e) => handleChange(e)}
            />
            <p className={styles.error}>{formErros.password}</p>
          </li>

          <li>
            <label>確認用パスワード</label>
            <input
              type="password"
              id="passwordTest"
              name="passwordTest"
              value={formValues.passwordTest}
              onChange={(e) => handleChange(e)}
            />
            <p className={styles.error}>{formErros.passwordTest}</p>
          </li>

          <li>
            <button type="submit">会員登録</button>
          </li>
        </ul>
      </form>
      <Link href={`/top`}>トップページへ</Link>
    </>
  );
}