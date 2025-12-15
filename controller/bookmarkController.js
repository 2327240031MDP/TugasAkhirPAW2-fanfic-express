import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
import FanFicModel from "../models/fanFicModel.js";

export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params; // fanfic id
    const userId = req.user.user_id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID FanFic tidak valid",
        data: null,
      });
    }

    const fanfic = await FanFicModel.findById(id);
    if (!fanfic) {
      return res.status(404).json({
        message: "Cerita tidak ditemukan",
        data: null,
      });
    }

    const user = await UserModel.findById(userId);

    const isBookmarked = user.bookmarks.includes(id);

    if (isBookmarked) {
      user.bookmarks.pull(id);
    } else {
      user.bookmarks.push(id);
    }

    await user.save();

    return res.status(200).json({
      message: isBookmarked
        ? "Bookmark dihapus"
        : "Berhasil menambahkan bookmark",
      data: user.bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal memproses bookmark",
      error: error.message,
      data: null,
    });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.user_id)
      .populate("bookmarks");

    return res.status(200).json({
      message: "Daftar bookmark",
      data: user.bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil bookmark",
      error: error.message,
      data: null,
    });
  }
};
