import mongoose, { mongo } from "mongoose"
import UserModel from "./userModel.js";


const CommentSchema = new mongoose.Schema({
  isi: {
    type: String,
    required: true,
    trim: true,
  },
  createdby: {
    type: mongoose.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FanFicSchema = new mongoose.Schema(
    {
        judul : {
            type : String,
            unique : true,
            required : true,
            trim : true
        },
        Cerita : {
            type : String,
            required : true,
            trim : true
        },
        Genre : {
            type : String,
            required : true,
            trim : true
        },
        createdby: {
            type : mongoose.Types.ObjectId,
            ref : UserModel
        },
        comments: [CommentSchema]
    },
    {
        timestamps : true
    }
);

const FanFicModel = mongoose.model("fanfic", FanFicSchema);

export default FanFicModel;