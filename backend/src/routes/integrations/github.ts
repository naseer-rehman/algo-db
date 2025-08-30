import express from "express";
import { 
  redirectToGithubAuthorizationEndpoint,
  handleGithubAuthorizationCallback
} from "../../controllers/integrations/github";

const router = express.Router();

router.get("/oauth2", redirectToGithubAuthorizationEndpoint);
router.get("/oauth2/callback", handleGithubAuthorizationCallback);

export default router;