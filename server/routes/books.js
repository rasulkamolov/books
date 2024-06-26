const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/inventory', (req, res) => {
    db.all('SELECT bookName, quantity FROM inventory', (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        }
        const inventory = {};
        rows.forEach(row => {
            inventory[row.bookName] = row.quantity;
        });
        res.json(inventory);
    });
});

router.post('/add', (req, res) => {
    const { bookName, quantity } = req.body;
    db.run('UPDATE inventory SET quantity = quantity + ? WHERE bookName = ?', [quantity, bookName], err => {
        if (err) {
            return res.status(500).send(err);
        }
        const timestamp = new Date().toLocaleString();
        db.run('INSERT INTO stats (timestamp, bookName, quantity, action) VALUES (?, ?, ?, ?)', [timestamp, bookName, quantity, 'add'], err => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send('Book added successfully');
        });
    });
});

router.post('/sell', (req, res) => {
    const { bookName, quantity } = req.body;
    db.run('UPDATE inventory SET quantity = quantity - ? WHERE bookName = ?', [quantity, bookName], err => {
        if (err) {
            return res.status(500).send(err);
        }
        const timestamp = new Date().toLocaleString();
        db.run('INSERT INTO stats (timestamp, bookName, quantity, action) VALUES (?, ?, ?, ?)', [timestamp, bookName, quantity, 'sell'], err => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send('Book sold successfully');
        });
    });
});

module.exports = router;
