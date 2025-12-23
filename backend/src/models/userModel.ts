import pool from "../utils/db";
import * as z from "zod";

const newUserSchema = z.object({
   githubUsername: z.string(),
   githubId: z.string(),
   githubAvatarUrl: z.url().nullable(),
   githubProfileUrl: z.url().nullable(),
   githubBio: z.string().nullable(),
   githubLocation: z.string().nullable(),
   githubAccessToken: z.string(),
   githubRefreshToken: z.string().nullable(),
});

const publicUserSchema = z.object({
   ...newUserSchema.shape,
   id: z.string(),
   karma: z.int(),
   createdAt: z.date(),
   updatedAt: z.date(),
   lastLoginAt: z.date(),
}).omit({
   githubAccessToken: true,
   githubRefreshToken: true,
});

const privateUserSchema = z.object({
   ...newUserSchema.shape,
   ...publicUserSchema.shape,
});

export type NewUser = z.infer<typeof newUserSchema>;
type PublicUser = z.infer<typeof publicUserSchema>;
export type {PublicUser as User};
type User = z.infer<typeof privateUserSchema>; // internal user type

export async function createUser(userInfo: NewUser) {
   userInfo = newUserSchema.parse(userInfo);
   const nowTimeUTC = new Date();
   type NewDatabaseUser = Omit<User, "id">;
   const userInfoForDatabase: NewDatabaseUser = {
      ...userInfo,
      karma: 0,
      createdAt: nowTimeUTC,
      updatedAt: nowTimeUTC,
      lastLoginAt: nowTimeUTC,
   };
   const insertUserQuery = 
      "INSERT INTO users (github_username, github_id, github_avatar_url, github_profile_url, github_bio, github_location, github_access_token, github_refresh_token, karma, created_at, updated_at, last_login_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
   const queryValues = [
      userInfoForDatabase.githubUsername,
      userInfoForDatabase.githubId,
      userInfoForDatabase.githubAvatarUrl,
      userInfoForDatabase.githubProfileUrl,
      userInfoForDatabase.githubBio,
      userInfoForDatabase.githubLocation,
      userInfoForDatabase.githubAccessToken,
      userInfoForDatabase.githubRefreshToken,
      userInfoForDatabase.karma,
      userInfoForDatabase.createdAt,
      userInfoForDatabase.updatedAt,
      userInfoForDatabase.lastLoginAt,
   ];
   const res = pool.query<User>(insertUserQuery, queryValues);
}

// Updates the last login date for the user to the current time and date.
export async function updateUserLastLoginDate(id) {
   return;
}

export async function updateUserKarma(id, newKarma) {
   return;
}

export async function getUserFromGithubUsername(githubUsername) {
   return;
}

export async function getUserFromId(id) {
   return;
}

export async function updateUserAccessToken(id, newAccessToken) {
   return;
}

export async function updateUserRefreshToken(id, newRefreshToken) {
   return;
}

export async function getAllUsers() {
   const result = await pool.query<User>(`SELECT id, github_username AS username FROM users LIMIT 1000;`);
   return result.rows.map(({id, githubUsername: username}) => {
      return {id, username};
   });
}