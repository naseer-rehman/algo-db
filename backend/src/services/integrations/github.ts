import axios from "axios";
import crypto from "crypto";
import { OAuthApp } from "@octokit/oauth-app";
import { sortAndDeduplicateDiagnostics } from "typescript";

const GITHUB_SCOPES = ["read:user"].sort();
const GITHUB_CLIENT_ID = Bun.env.GITHUB_CLIENT_ID ?? "null";
const GITHUB_CLIENT_SECRET = Bun.env.GITHUB_CLIENT_SECRET ?? "null";
const GITHUB_OAUTH_BASE_URL = "https://github.com/login/oauth/authorize"; 
const app = new OAuthApp({
  clientType: "oauth-app",
  clientId: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
});

export function getAuthorizationEndpoint() {
  const CALLBACK_URI_BASE = `http://${Bun.env.EXPRESS_HOST}:${Bun.env.EXPRESS_PORT}`
  const CALLBACK_URI = `${CALLBACK_URI_BASE}/api/integrations/github/oauth2/callback`;
  const RANDOM_STATE = crypto.randomBytes(16).toString("hex");
  const { url: authorizationUrl } = app.getWebFlowAuthorizationUrl({
    scopes: GITHUB_SCOPES,
    redirectUrl: CALLBACK_URI,
    state: RANDOM_STATE,
  });
  return new URL(authorizationUrl);
}

// TODO: Determine return type based on succeess or type of failure,
//       since there can be multiple forms of failures.
//       Example: HTTP state mismatch 
export async function retrieveAuthorizationToken(authCode: string) {
  const RANDOM_STATE = crypto.randomBytes(16).toString("hex");
  const { 
    authentication: { token, scopes }
  } = await app.createToken({
    code: authCode,
    state: RANDOM_STATE,
  });
  // TODO: Determine return type for failure
  if (scopes.length < GITHUB_SCOPES.length) {
    return false;
  }
  const containsRequiredScopes = GITHUB_SCOPES.every(
    (element) => scopes.includes(element)
  );
  if (!containsRequiredScopes) {
    // TODO: Return failure to allow correct scopes
    return false;
  }
  // Use the github API to retrieve user data and store the access token in the database
  return;
}