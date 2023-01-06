import { NextApiRequest, NextApiResponse } from 'next';
import { RentalHistory } from 'types/user';
import prisma from '../../../../lib/prisma';

export const selectRental = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let userId;
  const { selectRental } = req.query;
  userId = Number(selectRental);  
  const rentalHistories: RentalHistory[] =
    await prisma.rentalHistory.findMany({
      where: {
        userId: userId,
      },
    });

  rentalHistories.map((item) => {
    const tmp = item;
    tmp.payDate = String(item.payDate);
    if (tmp.rentalStart) {
      tmp.rentalStart = String(item.rentalStart);
      tmp.rentalEnd = String(item.rentalEnd);
    }
  });

  res.json({ rental: rentalHistories });
};

export default selectRental;
