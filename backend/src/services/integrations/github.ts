import axios from "axios";
import crypto from "crypto";
import { OAuthApp } from "@octokit/oauth-app";
import { Octokit } from "@octokit/rest";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { createUser, NewUser } from "../../models/userModel";

const GITHUB_SCOPES = ["read:user"].sort();
const GITHUB_CLIENT_ID = Bun.env.GITHUB_CLIENT_ID ?? "null";
const GITHUB_CLIENT_SECRET = Bun.env.GITHUB_CLIENT_SECRET ?? "null";
const GITHUB_OAUTH_BASE_URL = "https://github.com/login/oauth/authorize"; 
const oauthApp = new OAuthApp({
  clientType: "oauth-app",
  clientId: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
});
// const octokit = new Octokit({
//   userAgent: "algodb v1.0.0",
//   timeZone: "America/Toronto",
//   authStrategy: createOAuthAppAuth,
//   auth: {
//     clientId: GITHUB_CLIENT_ID,
//     clientSecret: GITHUB_CLIENT_SECRET,
//   },
// });

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
    // TODO: report error
  }
  return response.data;
}

// TODO: Create named errors for everything...
// TODO: Name this function better
export async function retrieveAuthorizationToken(authCode: string) {
  const RANDOM_STATE = crypto.randomBytes(16).toString("hex");
  const {
    authentication: { token, scopes }
  } = await oauthApp.createToken({
    code: authCode,
    state: RANDOM_STATE,
  });
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
  const userData = await retrieveUserData(token);
  console.log(userData);
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
  await createUser(newUser);
  return;
}