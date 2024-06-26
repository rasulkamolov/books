const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        bookName TEXT,
        quantity INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS stats (
        timestamp TEXT,
        bookName TEXT,
        quantity INTEGER,
        action TEXT
    )`);

    const books = [
        { bookName: 'Beginner', quantity: 0 },
        { bookName: 'Elementary', quantity: 0 },
        { bookName: 'Pre-Intermediate', quantity: 0 },
        { bookName: 'Intermediate', quantity: 0 },
        { bookName: 'Kids Level 1', quantity: 0 },
        { bookName: 'Kids Level 2', quantity: 0 },
        { bookName: 'Kids Level 3', quantity: 0 },
        { bookName: 'Kids Level 4', quantity: 0 },
        { bookName: 'Kids Level 5', quantity: 0 },
        { bookName: 'Kids Level 6', quantity: 0 },
        { bookName: 'Kids High Level 1', quantity: 0 },
        { bookName: 'Kids High Level 2', quantity: 0 },
        { bookName: 'Listening Beginner', quantity: 0 },
        { bookName: 'Listening Elementary', quantity: 0 },
        { bookName: 'Listening Pre-Intermediate', quantity: 0 },
        { bookName: 'Listening Intermediate', quantity: 0 }
    ];

    const stmt = db.prepare(`INSERT INTO inventory (bookName, quantity) VALUES (?, ?)`);
    books.forEach(book => {
        stmt.run(book.bookName, book.quantity);
    });
    stmt.finalize();
});

module.exports = db;
