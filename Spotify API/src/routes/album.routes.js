import { Router } from "express";
import { createAlbum, deleteAlbum, getAlbum, getAlbums, updateAlbum } from "../controllers/album.controller.js";
import { authUser, authArtist } from "../middlewares/auth.middleware.js";

const albumRouter = Router();

albumRouter.get("/", authUser, getAlbums);
albumRouter.get("/:id", authUser, getAlbum);
albumRouter.post("/", authArtist, createAlbum);
albumRouter.put("/:id", authArtist, updateAlbum);
albumRouter.delete("/:id", authArtist, deleteAlbum);

export default albumRouter;