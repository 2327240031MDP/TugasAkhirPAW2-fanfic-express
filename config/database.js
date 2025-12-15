import mongoose, { mongo } from "mongoose";


const database = async () => {
    try{
        console.log("koneksi ke database....");

        const response = await mongoose.connect("mongodb://127.0.0.1:27017/FanFic?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8");

        console.log("koneksi ke database berhasil");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

export default database;