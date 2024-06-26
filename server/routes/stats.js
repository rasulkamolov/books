const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/daily', (req, res) => {
    const { date } = req.query;
    db.all('SELECT timestamp, bookName, quantity, action FROM stats WHERE date(timestamp) = date(?)', [date], (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(rows);
    });
});

module.exports = router;
