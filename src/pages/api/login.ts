import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../lib/ironOprion"

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const body = { mailAddress: req.body.mailAddress, password: req.body.password };
    const url = 'http://localhost:3005/api/user/login';
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, params);
    const data = await response.json();

    if (data) {
      req.session.user = {
        ...data
      };
      await req.session.save();
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  },
  ironOptions,
);
