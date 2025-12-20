import mongoose from "mongoose";
import FanFicModel from "../models/fanFicModel.js";
import UserModel from "../models/userModel.js";

export const FanFic = async (req, res) => {
  try {
    const Fiction = await FanFicModel.find({
      createdby: req.user?.user_id
    }).sort({ createdAt: -1 });

    return res.status(201).json({
      message: "Daftar semua Cerita",
      data: Fiction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
      data: null,
    });
  }
};

// PUBLIC - Home (tanpa login)
export const getPublicFanFic = async (req, res) => {
  try {
    const fiction = await FanFicModel
      .find()
      .sort({ createdAt: -1 })
      .populate("createdby", "username")

    return res.status(200).json({
      message: "Daftar Cerita Publik",
      data: fiction
    })
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      data: null
    })
  }
}



export const addNewFanFic = async (req, res) => {
  try {
    const { judul, Cerita, Genre } = req.body;

    if (!judul || !Cerita || !Genre) {
      return res.status(400).json({
        message: "Semua field (judul, Cerita, Genre) wajib diisi",
        data: null
      });
    }

    // Menyimpan user_id pembuat ke database
    const Fiction = await FanFicModel.create({ judul, Cerita, Genre, createdby: req.user?.user_id });

    return res.status(201).json({
      message: "Berhasil menambahkan Cerita baru",
      data: Fiction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal menambahkan Certa",
      error: error.message,
      data: null,
    });
  }
};

export const detailFanFic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID tidak valid",
        data: null
      });
    }

    const Fiction = await FanFicModel.findById(id)
      .populate("createdby", "username")
      .populate("comments.createdby", "username");

    if (!Fiction) {
      return res.status(404).json({
        message: "Cerita tidak ditemukan",
        data: null
      });
    }

    let isBookmarked = false;

    // 🔥 CEK JIKA USER LOGIN
    if (req.user?.user_id) {
      const user = await UserModel.findById(req.user.user_id);
      isBookmarked = user.bookmarks.some(
        (b) => b.toString() === Fiction._id.toString()
      );
    }

    return res.status(200).json({
      message: "Detail Cerita",
      data: Fiction,
      isBookmarked
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
      data: null
    });
  }
};



export const updateFanFic = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, Cerita, Genre } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID tidak valid", data: null });
    }

    // Update hanya jika ID cocok DAN user pembuat cocok
    const updatedFiction = await FanFicModel.findOneAndUpdate(
      {
        _id: id,
        createdby: req.user?.user_id,
      },
      { judul, Cerita, Genre },
      { new: true }
    );

    if (!updatedFiction) {
      return res.status(404).json({ message: "Cerita tidak ditemukan atau akses ditolak", data: null });
    }

    return res.status(200).json({
      message: "Berhasil mengupdate Cerita",
      data: updatedFiction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
      data: null,
    });
  }
};

export const deleteFanFic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID tidak valid", data: null });
    }

    // Hapus hanya jika ID cocok DAN user pembuat cocok
    const deletedFanfic = await FanFicModel.findOneAndDelete({
      _id: id,
      createdby: req.user?.user_id,
    });

    if (!deletedFanfic) {
      return res.status(404).json({ message: "Cerita tidak ditemukan atau akses ditolak", data: null });
    }

    return res.status(201).json({
      message: "Berhasil menghapus Cerita",
      data: deletedFanfic,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
      data: null,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { isi } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID FanFic tidak valid",
        data: null,
      });
    }

    if (!isi) {
      return res.status(400).json({
        message: "Komentar tidak boleh kosong",
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

    fanfic.comments.push({
      isi,
      createdby: req.user.user_id,
    });

    await fanfic.save();

    return res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      data: fanfic.comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal menambahkan komentar",
      error: error.message,
      data: null,
    });
  }
};
