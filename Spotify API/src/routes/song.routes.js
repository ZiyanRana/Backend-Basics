import { Router } from "express";
import { getSongs, getSong, createSong, updateSong, deleteSong } from "../controllers/song.controller.js";
import { authUser, authArtist } from "../middlewares/auth.middleware.js";
import { songUpload } from "../middlewares/upload.middleware.js";

const songRouter = Router();

songRouter.get("/", authUser, getSongs);
songRouter.get("/:id", authUser, getSong);
songRouter.post("/", authArtist, songUpload, createSong);
songRouter.put("/:id", authArtist, songUpload, updateSong);
songRouter.delete("/:id", authArtist, deleteSong);

export default songRouter;