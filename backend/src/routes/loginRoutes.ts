import express, { Request, Response } from "express";
import { getUserByUserId } from "../models/userModel";

const router = express.Router();

const redirectToGithubAuth = (_req: Request, res: Response) => {
  res.redirect("/api/integrations/github/oauth2/");
};

router.get("/", async (req, res) => {
  if (req.session.userId) {
    const userId = req.session.userId;
    const userInfo = await getUserByUserId(userId);
    if (userInfo !== null) {
      // TODO: What to do if the user is already logged in?
      res.redirect("/");
      return;
    }
  }
  redirectToGithubAuth(req, res);
});

export default router;
