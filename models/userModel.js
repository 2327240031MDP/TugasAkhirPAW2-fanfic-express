import mongoose, { mongo } from "mongoose"


const UserSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            unique : true,
            required : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            trim : true
        },
        password : {
            type : String,
            required : true,
            trim : true
        },
        bookmarks: [
            {
                type: mongoose.Types.ObjectId,
                ref : "fanfic",
            }
        ]
    },
    {
        timestamps : true
    }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;