import express from "express"
import * as FanFicController from "../controller/fanFicController.js"
import * as UserController from "../controller/authController.js"
import { authenticateTokenMiddleware, optionalAuth } from "../middlewares/authenticateTokenMiddleware.js"
import * as BookmarkController from "../controller/bookmarkController.js"
import * as FollowController from "../controller/followController.js"

const api = express.Router()

/* ================= AUTH ================= */
api.post("/signin", UserController.signIn)
api.post("/signup", UserController.signUp)

/* ================= PUBLIC ================= */
// Home (tanpa login)
api.get("/public/fanfic", FanFicController.getPublicFanFic)

// Detail fanfic
api.get("/fanfic/:id", optionalAuth, FanFicController.detailFanFic)

/* ================= PRIVATE ================= */
// Fanfic CRUD
api.post("/fanfic", authenticateTokenMiddleware, FanFicController.addNewFanFic)
api.put("/fanfic/:id", authenticateTokenMiddleware, FanFicController.updateFanFic)
api.delete("/fanfic/:id", authenticateTokenMiddleware, FanFicController.deleteFanFic)

// Fanfic milik user
api.get("/fanfic/my", authenticateTokenMiddleware, FanFicController.FanFic)

// Comment
api.post(
  "/fanfic/:id/comment",
  authenticateTokenMiddleware,
  FanFicController.addComment
)

// Bookmark
api.post(
  "/fanfic/:id/bookmark",
  authenticateTokenMiddleware,
  BookmarkController.toggleBookmark
)

api.get(
  "/bookmarks",
  authenticateTokenMiddleware,
  BookmarkController.getBookmarks
)

// Follow
api.post(
  "/follow/:id",
  authenticateTokenMiddleware,
  FollowController.toggleFollow
)

api.get(
  "/following",
  authenticateTokenMiddleware,
  FollowController.getFollowing
)

api.get(
  "/followers",
  authenticateTokenMiddleware,
  FollowController.getFollowers
)

export default api