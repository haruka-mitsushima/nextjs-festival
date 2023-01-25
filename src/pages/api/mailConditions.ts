import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../../lib/ironOprion';
import prisma from '../../../lib/prisma';

export default withIronSessionApiRoute(async function loginRoute(
  req,
  res
) {
  const body = { mailAddress: req.body.formValues.mailAddress };
  const url = 'http://localhost:3005/api/user/mailConditions'
  const params = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, params);
  console.log(response)
  const item = await response.json();

  // const item = await prisma.user.findMany({
  //   where: {
  //     mailAddress: req.body.formValues.mailAddress,
  //   },
  // });

  if (item) {
    res.json({ result: false, message: 'このメールアドレスはすでに登録済みです' });
  } else {
    res.json({ result: true });
  }
},
  ironOptions);
