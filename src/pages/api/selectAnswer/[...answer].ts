import { NextApiRequest, NextApiResponse } from "next";
import { Item } from "types/item";
import prisma from '../../../../lib/prisma';

export default async function selectAnswer(req: NextApiRequest, res: NextApiResponse<object>) {
    let feeling = 0;
    let who = 0;
    const { answer } = req.query;
    if (Array.isArray(answer)) {
        feeling = Number(answer[0]);
        who = Number(answer[1])
    };
    const response = await prisma.chatbotAnswer.findUnique({
        where: {
            question1_question2: {
                question1: feeling,
                question2: who
            }
        },
    });

    res.json({ genre: response?.categoryId });
}
