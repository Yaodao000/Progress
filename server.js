const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // 用於解析 JSON 請求體

// 提供靜態檔案服務
app.use(express.static(path.join(__dirname, 'public'))); // 將 public 資料夾設置為靜態檔案目錄

// 模擬用戶資料
const USERS = [
    { username: 'testuser', password: 'password123' }
];

// 設置根路徑處理，回傳 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 定義 /api/login 路徑
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 模擬用戶驗證邏輯
    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
