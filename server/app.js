const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const booksRouter = require('./routes/books');
const statsRouter = require('./routes/stats');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use('/books', booksRouter);
app.use('/stats', statsRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
