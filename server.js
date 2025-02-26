const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');


const app = express();
PORT = 3000;


const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Ошибка подключния к базе данных: ', err.message);
    } else {
        console.log('Подключено к базе данных!')
    }
})


db.run(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegramUserId INTEGER UNIQUE 
    )    
`);



app.use(cors());
app.use(express.json());



app.post('/saveUser', (req, res) => {
    const { telegramUserId } = req.body;

    if (!telegramUserId) {
        return res.status(400).json({ error: 'telegramUserId обязателен!'});
    }

    db.run(`INSERT OR IGNORE INTO users (telegramUserId) VALUES (?)`, [telegramUserId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Идентификатор сохранен', id: this.lastID });
    })
})








app.get('/getUser/:telegramUserid', (req, res) => {
    const { telegramUserId } = req.params;

    db.get(`SELECT * FROM users WHERE telegramUserId = ?`, [telegramUserId], (err, row) => {
        if(err) {
            return res.status(500).json({ error: err.message})
        } 
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    });
});
    
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});