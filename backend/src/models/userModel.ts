import pool from "../utils/db";
import * as z from "zod";

// TODO: Find an interface to expose and one to use internally...
type UserCore = {
  id: string,
  githubUsername: string,
  githubId: string,
  githubAvatarUrl: string | null,
  githubProfileUrl: string | null,
  githubBio: string | null,
  githubLocation: string | null,
  karma: number,
  createdAt: string,
  updatedAt: string,
  lastLoginAt: string,
};

type UserSecrets = {
  githubAccessToken: string,
  githubRefreshToken: string | null,
};

// internal
type User = UserCore & UserSecrets;

export type PublicUser = UserCore;

const userSchema = z.object({
  id: z.string(),
  githubUsername: z.string(),
  githubId: z.string(),
  githubAvatarUrl: z.url().nullable(),
  githubProfileUrl: z.url().nullable(),
  githubBio: z.string().nullable(),
  githubLocation: z.string().nullable(), // string | null,
  karma: z.int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date(),
  githubAccessToken: z.string(),
  githubRefreshToken: z.string().nullable(),
});

const NEW_USER_OMITIONS = ["id", "karma", "createdAt", "updatedAt", "lastLoginAt"] as const;
type NewUserOmitions = typeof NEW_USER_OMITIONS[number];
export type NewUser = Omit<User, NewUserOmitions>;
const newUserSchema = userSchema.omit({ id: true, karma: true, createdAt: true, updatedAt: true, lastLoginAt: true });

// TODO: fix the parameter type/shape...
export async function createUser(userInfo: NewUser) {
  const nowTimeUTC = new Date().toUTCString();
  type NewDatabaseUser = Omit<User, "id">;
  const userInfoForDatabase: NewDatabaseUser = {
    ...userInfo,
    karma: 0,
    createdAt: nowTimeUTC,
    updatedAt: nowTimeUTC,
    lastLoginAt: nowTimeUTC,
  };
  userInfo = newUserSchema.parse(userInfo);
  const queryValueOrder = ["github_username", "github_id", "github_avatar_url", "github_profile_url", "github_bio", "github_location", "github_access_token", "github_refresh_token", "karma", "created_at", "updated_at", "last_login_at"];
  const queryValueParameterOrder = queryValueOrder.map((_, ind) => `\$${ind+1}`).join(", ");
  const queryCommand = `INSERT INTO users (${queryValueOrder.join(", ")}) VALUES (${queryValueParameterOrder}) RETURNING *`;
  const values = 
    ["githubUsername", "githubId", "githubAvatarUrl", "githubProfileUrl", "githubBio", "githubLocation", "githubAccessToken", "githubRefreshToken", "karma", "createdAt", "updatedAt", "lastLoginAt"]
    .map((val) => userInfoForDatabase[val as keyof NewDatabaseUser]);
  const res = pool.query<User>(queryCommand, values);
  console.log(res);
}

export async function getAllUsers() {
  // const result = await db.query<User>(`SELECT id, github_username AS username FROM users LIMIT 1000;`);
  // return result.rows.map(([id, username]: [string, number]) => {
  //   return {id, username};
  // });
}