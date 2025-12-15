import express from "express"
import database from "./config/database.js"
import api from "./routes/api.js"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({
        message : "ok"
    })
})

app.use('/api', api)

app.listen(3000, () => {
    database();
    console.log(`aplikasi berjalan di http://localhost:3000`);
})