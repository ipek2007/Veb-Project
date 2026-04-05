// Server qurmaq üçün
import express from "express";

// Frontend-dən request qəbul etmək üçün
import cors from "cors";

// .env faylını oxumaq üçün
import dotenv from "dotenv";

// PostgreSQL bağlantısı üçün
import pg from "pg";

// Şifrəni hash etmək üçün
import bcrypt from "bcrypt";

// .env aktiv edilir
dotenv.config();

// Express app yaradılır
const app = express();

// pg-dən Pool götürürük (connection idarəsi üçün)
const { Pool } = pg;

// Middleware-lər
app.use(cors());           // frontend request ata bilsin
app.use(express.json());   // JSON oxumaq üçün

// PostgreSQL bağlantısı
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Test bağlantı
pool.connect()
  .then(() => console.log("Database qoşuldu"))
  .catch(err => console.error("DB xətası:", err));


// REGISTER endpoint
app.post("/register", async (req, res) => {
  try {
    // Frontend-dən gələn məlumatlar
    const { fullname, email, password } = req.body;

    // Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "Bütün xanaları doldur"
      });
    }

    // Email databazada varmı?
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    // Əgər varsa error
    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "Email artıq mövcuddur"
      });
    }

    // Şifrə hash edilir (təhlükəsizlik üçün)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni user əlavə edilir
    await pool.query(
      "INSERT INTO users(fullname,email,password) VALUES($1,$2,$3)",
      [fullname, email, hashedPassword]
    );

    // Uğurlu cavab
    res.json({
      message: "Qeydiyyat tamamlandı"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server xətası"
    });
  }
});

// Serveri işə salırıq
app.listen(process.env.PORT, () => {
  console.log("Server işləyir: http://localhost:" + process.env.PORT);
});