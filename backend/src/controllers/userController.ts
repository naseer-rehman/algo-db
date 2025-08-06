import { Request, Response } from "express";
import { getUsers as getAllUsers } from "../services/userServices";

export async function getUsers(_req: Request, _res: Response) {
  const users = await getAllUsers();
  _res.json(users);
}