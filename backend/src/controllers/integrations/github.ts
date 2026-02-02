import { Request, Response } from "express";
import { 
  getAuthorizationEndpoint, 
  getGitHubUserData, 
  retrieveAuthorizationToken,
  createNewUserFromData,
  createNewUserFromToken,
  createUserIfNotExistsFromGitHubData,
} from "../../services/integrations/github";
import crypto from "crypto";
import { getUserByGithubId } from "../../models/userModel";

export function redirectToGithubAuthorizationEndpoint(req: Request, res: Response) {
  const link = getAuthorizationEndpoint();
  const state = link.searchParams.get("state");
  const maxAgeMilliseconds = 1000 * 60 * 5;
  res.cookie("state", state, {
    maxAge: maxAgeMilliseconds,
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // NOTE: Add this in when we start using HTTPS
  });
  res.redirect(link.toString());
}

const textEncoder = new TextEncoder();
export async function handleGithubAuthorizationCallback(req: Request, res: Response) {
  const hasValidParam = (name: string) => {
    return name in req.query && typeof req.query[name] === "string";
  };
  const hasValidParamType = (name: string, type: string) => {
    return name in req.query && typeof req.query[name] === type;
  };
  const hasValidCodeParam = hasValidParam("code");
  const hasValidStateParam = hasValidParam("state");
  const hasValidStateCookie = "state" in req.signedCookies 
    && req.signedCookies.state !== false;
  if (!hasValidCodeParam || !hasValidStateParam || !hasValidStateCookie) {
    res.sendStatus(400);
    return;
  }
  const code = req.query.code as string;
  const clientState: string = req.signedCookies.state;
  const githubState = req.query.state as string;
  const encodedClientState = textEncoder.encode(clientState);
  const encodedGithubState = textEncoder.encode(githubState);
  if (encodedClientState.byteLength !== encodedGithubState.byteLength) {
    res.clearCookie("state");
    res.sendStatus(401);
    return;
  }
  res.clearCookie("state");
  if (!crypto.timingSafeEqual(encodedClientState, encodedGithubState)) {
    res.sendStatus(401);
    return;
  }
  const token = await retrieveAuthorizationToken(code);
  if (!token) {
    // TODO: Throw named exception to make it clear what the issue is
    // In this case, scopes or state mismatched
    res.sendStatus(401);
  }

  // TODO: Error handle this call if we can't retrieve the github user data
  const githubUserData = await getGitHubUserData(token);
  const dbUserData = await createUserIfNotExistsFromGitHubData(token, githubUserData);

  if (dbUserData === null) {
    res.status(500).send("Unable to create new AlgoDB account :(");
    return;
  }
  req.session.userId = dbUserData.id;
  res.redirect("/");
}