import crypto from "crypto";
import { OAuthApp } from "@octokit/oauth-app";
import { Octokit } from "@octokit/rest";
import { createUser, getUserByGithubId, NewUser } from "../../models/userModel";

const GITHUB_SCOPES = ["read:user"].sort();
const GITHUB_CLIENT_ID = Bun.env.GITHUB_CLIENT_ID ?? "null";
const GITHUB_CLIENT_SECRET = Bun.env.GITHUB_CLIENT_SECRET ?? "null";
const GITHUB_OAUTH_BASE_URL = "https://github.com/login/oauth/authorize"; 
const oauthApp = new OAuthApp({
  clientType: "oauth-app",
  clientId: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
});

type GitHubUserData = Awaited<ReturnType<typeof retrieveUserData>>;

export function getAuthorizationEndpoint() {
  const CALLBACK_URI_BASE = `http://${Bun.env.EXPRESS_HOST}:${Bun.env.EXPRESS_PORT}`
  const CALLBACK_URI = `${CALLBACK_URI_BASE}/api/integrations/github/oauth2/callback`;
  const RANDOM_STATE = crypto.randomBytes(16).toString("hex");
  const { url: authorizationUrl } = oauthApp.getWebFlowAuthorizationUrl({
    scopes: GITHUB_SCOPES,
    redirectUrl: CALLBACK_URI,
    state: RANDOM_STATE,
  });
  return new URL(authorizationUrl);
}

export async function retrieveUserData(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const response = await octokit.rest.users.getAuthenticated({
    access_token: accessToken,
  });
  if (response.status != 200) {
    // TODO: Name this error
    throw new Error("Failed to retrieve Github user data.");
  }
  return response.data;
}

// TODO: Create named errors for everything...
// TODO: Name this function better
export async function retrieveAuthorizationToken(authCode: string) {
  const RANDOM_STATE = crypto.randomBytes(16).toString("hex");
  const oauthAppTokenData = await oauthApp.createToken({
    code: authCode,
    state: RANDOM_STATE,
  });
  const {
    authentication: { token, scopes }
  } = oauthAppTokenData;
  // TODO: Name this error
  if (scopes.length < GITHUB_SCOPES.length) {
    throw new Error("Insufficient scopes allowed.");
  }
  const containsRequiredScopes = GITHUB_SCOPES.every(
    (element) => scopes.includes(element)
  );
  if (!containsRequiredScopes) {
    // TODO: Name this error
    throw new Error("Insufficient scopes allowed.");
  }
  return token;
}

/**
 * Creates a new user account from the provided github user data, if an account doesn't
 * already exist for the github account.
 * @param githubUserData 
 * @returns 
 */
export async function createUserIfNotExistsFromGitHubData(
  token: string, githubUserData: GitHubUserData) {
  const existingUserData = await getUserByGithubId(githubUserData.id.toString());
  if (existingUserData !== null) {
    return existingUserData;
  }
  return await createNewUserFromData(token, githubUserData);
}

export async function getGitHubUserData(token: string) {
  return await retrieveUserData(token);
}

export async function createNewUserFromToken(token: string) {
  const userData = await retrieveUserData(token);
  return createNewUserFromData(token, userData);
}

export async function createNewUserFromData(token: string, userData: GitHubUserData) {
    const newUser: NewUser = {
    githubUsername: userData.login,
    githubId: userData.id.toString(),
    githubAvatarUrl: userData.avatar_url,
    githubProfileUrl: userData.html_url,
    githubBio: userData.bio,
    githubLocation: userData.location,
    githubAccessToken: token,
    githubRefreshToken: null,
  };
  return await createUser(newUser);
}