import axios from "axios";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../lib/ironOprion"

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const body = { ...req.body };
    const url = 'http://localhost:3005/api/user/login';
    const response = await axios.post(url, body);
    const data = await response.data;

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
