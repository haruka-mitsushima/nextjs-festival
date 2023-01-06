import { NextApiRequest, NextApiResponse } from 'next';
import { type } from 'os';
import prisma from '../../../../lib/prisma';

export const selectReview = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let itemId;
  let orderBy;
  let order;

  const { selectReview } = req.query;
  if (Array.isArray(selectReview)) {
    itemId = Number(selectReview[0]);
    orderBy = selectReview[1];
    order = selectReview[2];
  }

  if (typeof orderBy !== 'string') {
    return;
  }
  if (typeof order !== 'string') {
    return;
  }

  const result = await prisma.review.findMany({
    where: {
      itemId: itemId,
    },
    orderBy: {
      [orderBy]: order,
    },
  });

  const total = await prisma.review.count({
    where: {
      itemId: itemId,
    },
  });

  res.json({ data: result, count: total });
};

export default selectReview;
