import express from "express";
import { getUsers } from "../controllers/userController.ts"

const router = express.Router();

router.get("/users", getUsers);

export default router;