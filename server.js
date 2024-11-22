const express = require('express'); 
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');  // 引入 MySQL 模組
const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // 用於解析 JSON 請求體
app.use(cors()); // 啟用 CORS
app.use(express.static(path.join(__dirname, 'public'))); // 提供靜態檔案

// 設定 MySQL 連接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // MySQL 用戶名
  password: '123456789',  // MySQL 密碼
  database: 'my_database'
});

// 連接到 MySQL
db.connect(err => {
  if (err) {
    console.error('資料庫連接錯誤: ' + err.stack);
    return;
  }
  console.log('已成功連接至資料庫');
});

// 設置根路徑處理，回傳 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 定義 /api/login 路徑
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 查詢用戶資料庫
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '資料庫錯誤' });
        }

        if (results.length > 0) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// 定義 /api/register 路徑
app.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // 查詢資料庫是否有相同的用戶名或電子郵件
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '資料庫錯誤' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // 將新用戶資料插入到資料庫
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, password], (err, results) => {
            if (err) {
                return res.status(500).json({ message: '註冊失敗' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
