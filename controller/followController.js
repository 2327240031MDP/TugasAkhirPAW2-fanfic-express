import mongoose from "mongoose"
import UserModel from "../models/userModel.js"

export const toggleFollow = async (req, res) => {
  try {
    const { id } = req.params // author id to follow/unfollow
    const userId = req.user.user_id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID User tidak valid",
        data: null,
      })
    }

    if (id === userId) {
      return res.status(400).json({
        message: "Tidak bisa follow diri sendiri",
        data: null,
      })
    }

    const author = await UserModel.findById(id)
    if (!author) {
      return res.status(404).json({
        message: "User tidak ditemukan",
        data: null,
      })
    }

    const user = await UserModel.findById(userId)

    const isFollowing = user.following.some(
      (followId) => followId.toString() === id
    )

    if (isFollowing) {
      // Unfollow
      user.following.pull(id)
      author.followers.pull(userId)
    } else {
      // Follow
      user.following.push(id)
      author.followers.push(userId)
    }

    await user.save()
    await author.save()

    return res.status(200).json({
      message: isFollowing
        ? "Berhenti follow"
        : "Berhasil follow",
      isFollowing: !isFollowing,
    })
  } catch (error) {
    return res.status(500).json({
      message: "Gagal memproses follow",
      error: error.message,
      data: null,
    })
  }
}

export const getFollowing = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.user_id)
      .populate("following", "username email")

    return res.status(200).json({
      message: "Daftar following",
      data: user.following,
    })
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil following",
      error: error.message,
      data: null,
    })
  }
}

export const getFollowers = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.user_id)
      .populate("followers", "username email")

    return res.status(200).json({
      message: "Daftar followers",
      data: user.followers,
    })
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil followers",
      error: error.message,
      data: null,
    })
  }
}