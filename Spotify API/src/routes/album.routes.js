import { Router } from "express";

const albumRouter = Router();

albumRouter.get("/", getAlbums);
albumRouter.get("/:id", getAlbum);
albumRouter.post("/", createAlbum);
albumRouter.put("/:id", updateAlbum);
albumRouter.delete("/:id", deleteAlbum);

export default albumRouter;