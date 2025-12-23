import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import integrationRoutes from "./routes/integrationRoutes";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser(Bun.env.COOKIES_SECRET ?? "monkey hand on chin"));
app.use(express.json());

app.get("/", (_req, res) => res.sendStatus(501));

const redirectToGithubAuth = (_req: Request, res: Response) => {
  res.redirect("/api/integrations/github/oauth2/");
};
app.get("/login", redirectToGithubAuth);
app.use("/api/integrations", integrationRoutes);
app.use("/api/users", userRoutes);

// TODO: Add in global error handler
// app.use(globalErrorHandler);

app.listen(8000);
