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
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
   lastLoginAt: z.coerce.date(),
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

// TODO: Create a zod schema for the user row
type UserRow = {
   github_username: User["githubUsername"],
   github_id: User["githubId"],
   github_avatar_url: User["githubAvatarUrl"],
   github_profile_url: User["githubProfileUrl"],
   github_bio: User["githubBio"],
   github_location: User["githubLocation"],
   github_access_token: User["githubAccessToken"],
   github_refresh_token: User["githubRefreshToken"],
   id: User["id"],
   karma: User["karma"],
   created_at: User["createdAt"],
   updated_at: User["updatedAt"],
   last_login_at: User["lastLoginAt"],
};

function mapUserRowToUser(userRow: UserRow): User {
   return {
      githubUsername: userRow.github_username,
      githubId: userRow.github_id,
      githubAvatarUrl: userRow.github_avatar_url,
      githubProfileUrl: userRow.github_profile_url,
      githubBio: userRow.github_bio,
      githubLocation: userRow.github_location,
      githubAccessToken: userRow.github_access_token,
      githubRefreshToken: userRow.github_refresh_token,
      id: userRow.id,
      karma: userRow.karma,
      createdAt: userRow.created_at,
      updatedAt: userRow.updated_at,
      lastLoginAt: userRow.last_login_at,
   };
}

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
      "INSERT INTO users (github_username, github_id, github_avatar_url, github_profile_url, github_bio, github_location, github_access_token, github_refresh_token, karma, created_at, updated_at, last_login_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";
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
   const res = await pool.query<User>(insertUserQuery, queryValues);
   return (!!res.rowCount && res.rowCount > 0) ? res.rows[0] : null;
}

// Updates the last login date for the user to the current time and date.
export async function updateUserLastLoginDate(id: string) {
   return;
}

export async function updateUserKarma(id: string, newKarma: number) {
   return;
}

export async function getUserByGithubUsername(githubUsername: string) {
   return;
}

/**
 * Returns null if the user doesn't exist.
 */
export async function getUserByUserId(id: string) {
   const getUserQuery = 
      "SELECT * FROM users WHERE id = $1";
   const res = await pool.query<UserRow>(getUserQuery, [id]);
   if (res.rowCount === null || res.rowCount === 0) return null;
   if (res.rowCount > 1) {
      throw Error(`More than one user with id "${id}"`);
   }
   const userData = mapUserRowToUser(res.rows[0]);
   return userData;
}

export async function getPublicUserByUserId(id: string): Promise<PublicUser | null> {
   const userData = await getUserByUserId(id);
   if (userData === null) return null;
   const {githubAccessToken, githubRefreshToken, ...publicUserData} = userData;
   return publicUserData;
}

export async function getUserByGithubId(githubId: string) {
   const getUserQuery = 
      "SELECT * FROM users WHERE github_id = $1";
   const res = await pool.query<UserRow>(getUserQuery, [githubId]);
   if (res.rowCount === null || res.rowCount === 0) return null;
   if (res.rowCount > 1) {
      throw Error(`More than one user with github id "${githubId}"`);
   }
   const userData = mapUserRowToUser(res.rows[0]);
   return userData;
}

export async function updateUserAccessToken(id: string, newAccessToken: string) {
   return;
}

export async function updateUserRefreshToken(id: string, newRefreshToken: string) {
   return;
}

export async function getAllUsers() {
   const result = await pool.query<User>(`SELECT id, github_username AS username FROM users LIMIT 1000;`);
   return result.rows.map(({id, githubUsername: username}) => {
      return {id, username};
   });
}