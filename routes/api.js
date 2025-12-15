import express from "express"
import * as FanFicController from "../controller/fanFicController.js"
import * as UserController from "../controller/authController.js"
import { authenticateTokenMiddleware } from "../middlewares/authenticateTokenMiddleware.js"
import * as BookmarkController from "../controller/bookmarkController.js";


const api = express.Router()

api.post("/signin", UserController.signIn)
api.post("/signup", UserController.signUp)

api.get("/fanfic", authenticateTokenMiddleware, FanFicController.FanFic);
api.get("/fanfic/:id", authenticateTokenMiddleware, FanFicController.detailFanFic);
api.post("/fanfic", authenticateTokenMiddleware, FanFicController.addNewFanFic);
api.put("/fanfic/:id", authenticateTokenMiddleware, FanFicController.updateFanFic);
api.delete("/fanfic/:id", authenticateTokenMiddleware, FanFicController.deleteFanFic);

api.post("/fanfic/:id/comment",authenticateTokenMiddleware, FanFicController.addComment);

api.post("/fanfic/:id/bookmark",authenticateTokenMiddleware,BookmarkController.toggleBookmark);
api.get("/bookmarks",authenticateTokenMiddleware,BookmarkController.getBookmarks);



export default api