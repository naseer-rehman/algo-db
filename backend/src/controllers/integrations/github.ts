import { Request, Response } from "express";
import { getAuthorizationEndpoint, retrieveAuthorizationToken } from "../../services/integrations/github";
import crypto from "crypto";

export function redirectToGithubAuthorizationEndpoint(req: Request, res: Response) {
  const link = getAuthorizationEndpoint();
  const state = link.searchParams.get("state");
  res.cookie("state", state, {
    maxAge: 1000 * 60 * 5,
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // Add this in when we start using HTTPS
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
  // if (token === false) {
  //   // TODO: Throw exception to make it clear what the issue is?
  //   // In this case, scopes or state mismatched
  //   res.sendStatus(401);
  // }
  res.sendStatus(501);
}