import express from "express";
import userRoutes from "./routes/userRoutes";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

const app = express();
// app.use(router.routes());
// app.use(router.allowedMethods());

app.use("/users", userRoutes);
app.use("/", router);

app.listen(8000);
