import UserModel from "../models/userModel.js";
import { hashedPassword, verifyPassword } from "../utils/hashUtils.js";
import { getJwtToken } from "../utils/jwtSignutil.js";


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                error: "Email dan password wajib diisi",
                data: null,
            });
        }

        // Mencari user berdasarkan email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                error: "Email atau password salah",
                data: null,
            });
        }

        // Verifikasi password
        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                error: "Password salah",
                data: null,
            });
        }

        // Generate token jika valid
        const token = getJwtToken(user._id, user.username);

        return res.status(200).send({
            message: "Login berhasil",
            data: { token },
        });

    } catch (error) {
        return res.status(400).send({
            message: error.message,
            error,
            data: null,
        });
    }
};

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({
                error: "Username, email, dan password wajib diisi",
                data: null,
            });
        }

        // Enkripsi password sebelum disimpan
        const hashPassword = await hashedPassword(password);

        const newUser = await UserModel.create({
            username,
            email,
            password: hashPassword,
        });

        if (newUser) {
            return res.status(200).send({
                message: "Berhasil melakukan pendaftaran, silakan login",
                data: null,
            });
        }

        return res.status(500).send({
            message: "Gagal melakukan pendaftaran, silakan coba lagi",
            data: null,
        });

    } catch (error) {
        return res.status(400).send({message: error.message,error,data:null})
    }
}