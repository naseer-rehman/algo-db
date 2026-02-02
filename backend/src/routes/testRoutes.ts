import express from "express";
import { getPublicUserByUserId, getUserByUserId } from "../models/userModel";

const router = express.Router();

// TODO: Create a middleware for user authentication
//       Also could populate req.user with (public?) user information
router.get("/", async (req, res) => {
  if (req.session.userId) {
    const userData = await getPublicUserByUserId(req.session.userId);
    if (userData !== null) {
      res.status(200).send(`Welcome, ${userData.githubUsername}!`);
      return;
    }
  }
  res.redirect("/login");
});

export default router;