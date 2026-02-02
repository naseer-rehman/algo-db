import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes";
import integrationRoutes from "./routes/integrationRoutes";
import testRoutes from "./routes/testRoutes";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import connectPgSimple from "connect-pg-simple";
import pgPool from "./utils/db";

const app = express();

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

app.use(helmet());
app.use(cors());
const pgSession = connectPgSimple(expressSession);
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
app.use(expressSession({
  store: new pgSession({
    pool: pgPool,
    createTableIfMissing: true,
  }),
  secret: Bun.env.COOKIES_SECRET ?? "monkey hand on chin",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: ONE_WEEK_MS },
}));
app.use(cookieParser(Bun.env.COOKIES_SECRET ?? "monkey hand on chin"));
app.use(express.json());

app.get("/", (_req, res) => res.redirect("/test"));

app.use("/login", loginRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/users", userRoutes);
app.use("/test", testRoutes);

// TODO: Add in global error handler
// app.use(globalErrorHandler);

app.listen(8000);
