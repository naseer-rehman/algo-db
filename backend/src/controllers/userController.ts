import { getUsers as getAllUsers } from "../services/userServices.ts";

export function getUsers() {
  return getAllUsers();
}