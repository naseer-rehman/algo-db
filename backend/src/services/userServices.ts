import { getAllUsers } from "../models/userModel.ts"

export function getUsers() {
  return getAllUsers();
}