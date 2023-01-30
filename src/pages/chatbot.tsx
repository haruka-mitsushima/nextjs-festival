import Head from 'next/head';
import useSWR, { mutate } from 'swr';
import { SessionUser } from './api/getSessionInfo';
import Header from 'components/Header';
import React from 'react';
import loadStyles from 'styles/loading.module.css';
import Chatbot from 'components/Chatbot';
import prisma from '../../lib/prisma';
import { ironOptions } from '../../lib/ironOprion';
import { withIronSessionSsr } from 'iron-session/next';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
type ChatList = {
  chatbotId: number;
  text?: string;
  chatbotChoice: Array<Choice>;
  continue: boolean;
  option: string;
};
type Choice = {
  chatbotChoiceId: number;
  chatbotId: number;
  text: string;
};

export default function ChatbotPage({
  chatList,
  userName,
}: {
  chatList: Array<ChatList>;
  userName: string;
}) {
  const { data } = useSWR<SessionUser>(
    '/api/getSessionInfo',
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
  return (
    <>
      <Head>
        <title>チャットボット</title>
      </Head>
      <Header
        isLoggedIn={data?.isLoggedIn}
        dologout={() => mutate('/api/getSessionInfo')}
      />
      <Chatbot chatList={chatList} userName={userName} data={data} />
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const chatList = await prisma.chatbot.findMany({
      include: { chatbotChoice: true },
      orderBy: { chatbotId: 'asc' },
    });

    let userName = 'guest';
    // ログインしている場合、userNameを取得する
    if (req.session.user) {
      const result = await prisma.user.findUnique({
        where: {
          userId: req.session.user.userId,
        },
      });
      if (result?.userName) {
        userName = result.userName;
      }
    }

    return {
      props: {
        chatList,
        userName,
      },
    };
  },
  ironOptions
);
