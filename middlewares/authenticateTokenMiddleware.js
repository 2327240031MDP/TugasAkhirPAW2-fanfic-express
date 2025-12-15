import jwt from "jsonwebtoken";

export const authenticateTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      error: "No token provided",
    });
  }

  // Format token biasanya "Bearer [TOKEN]", ambil elemen kedua
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).send({
      error: "No token provided"
    });
  }

  jwt.verify(token, "APP_JWT_SECRET", (err, decoded) => {
    if (err) {
      return res.status(401).send({
        error: "Invalid token",
        details: err.message,
      });
    }

    // Menyimpan data user yang terdeskripsi ke dalam object request
    req.user = decoded;
    next();
  });
};