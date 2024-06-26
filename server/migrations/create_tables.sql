CREATE TABLE IF NOT EXISTS inventory (
    bookName TEXT,
    quantity INTEGER
);

CREATE TABLE IF NOT EXISTS stats (
    timestamp TEXT,
    bookName TEXT,
    quantity INTEGER,
    action TEXT
);

INSERT INTO inventory (bookName, quantity) VALUES 
    ('Elementary', 0), 
    ('Intermediate', 0), 
    ('Advanced', 0);
