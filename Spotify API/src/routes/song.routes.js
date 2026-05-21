import { Router } from "express";
import { getSongs } from "../controllers/song.controller.js";

const songRouter = Router();

songRouter.get("/", getSongs);
songRouter.get("/:id", getSong);
songRouter.post("/", createSong);
songRouter.put("/:id", updateSong);
songRouter.delete("/:id", deleteSong);

export default songRouter;