import Head from 'next/head';
import { useEffect, useState } from 'react';
import router from 'next/router';
import UseSWR, { mutate } from 'swr';
import { SessionUser } from './api/getUser';
import Header from 'components/Header';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ChatBot() {
  const [genre, setGenre] = useState(0);

  const { data } = UseSWR<SessionUser>('/api/getUser', fetcher);
  if (!data) return <div>Loading</div>;

  const submit = async (e: any) => {
    const info = { favoriteGenre: Number(e.target.value) };
    await fetch(`http://localhost:3000/api/users/${data.userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((info) => {
        console.log('Success:', info);
        router.push('/');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  return (
    <>
      <Head>
        <title>ChatBot</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getSessionInfo')}
      />
      <h1>
        {data.userName}さんの興味のあるジャンルを選択してください！
      </h1>
      <form method="get" id="form" onChange={(e) => submit(e)}>
        <input name="favoriteGenre" id="1" type="radio" value={1} />
        <label htmlFor="1">アイドル</label>
        <input name="favoriteGenre" id="2" type="radio" value={2} />
        <label htmlFor="2">女性アーティスト</label>
        <input name="favoriteGenre" id="3" type="radio" value={3} />
        <label htmlFor="3">バンド</label>
        <input name="favoriteGenre" id="4" type="radio" value={4} />
        <label htmlFor="4">男性アーティスト</label>
      </form>
    </>
  );
}
