import express from "express";
import { githubIntegrationRouter } from "./integrations";

const router = express.Router();

router.use("/github", githubIntegrationRouter);

export default router;