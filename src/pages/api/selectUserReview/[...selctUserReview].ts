import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export const selctUserReview = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let userId;
  let itemId;
  const { selctUserReview } = req.query;
  if (Array.isArray(selctUserReview)) {
    userId = Number(selctUserReview[0]);
    itemId = Number(selctUserReview[1]);
  } else {
    return res.redirect('/error');
  }
  if (userId) {
    const review = await prisma.review.findMany({
      where: {
        userId: userId,
        itemId: itemId,
      },
    });
    res.json({ result: review });
  } else {
    res.json({ result: [] });
  }
};

export default selctUserReview;
