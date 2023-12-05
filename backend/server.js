const express = require('express');
const cors = require('cors');
const app = express();
const promisify = require("util").promisify

const mysql = require("mysql")


const port = 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

const db = mysql.createConnection({
    host: 'db4free.net',
    user: 'braindeck', // your MySQL username
    password: 'braindeck123', // your MySQL password
    database: 'braindeckdb', // your database name
});

const query = promisify(db.query).bind(db);

app.get('/', (req, res) => {
    res.send('Server is running!!');
})

app.get('/todo', (req, res) => {
    res.send('Hello World!');
})



app.post('/user', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const user = await query(
            `INSERT INTO user(name, email, password) VALUES(?, ?, ?)`,
            [name, email, password]
        )
        const [insertedUser] = await query(
            `SELECT * FROM user WHERE user_id = ?`,
            [user.insertId]
        );
        res.send(insertedUser);
    } catch (error) {
        res.send(error.message)
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const [user] = await query(
            `SELECT * FROM user WHERE email = ? AND password = ?`,
            [email, password]
        )
        if (!user) {
            throw Error("Wrong email password!")
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const user = await query(
            `INSERT INTO user(name, email, password) VALUES(?, ?, ?)`,
            [name, email, password]
        )
        const [insertedUser] = await query(
            `SELECT * FROM user WHERE user_id = ?`,
            [user.insertId]
        );
        res.send(insertedUser);
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/subject', async (req, res) => {
    try {
        const { subjectName, user_id } = req.body;
        await query(
            `INSERT INTO subjects(subject_name, user_id) VALUES(?,?)`,
            [subjectName, user_id]
        );
        res.send({ success: true });
    } catch (error) {
        res.send(error.message);
    }
})

app.get('/subject', async (req, res) => {
    try {
        const { user_id } = req.query;
        const subjects = await query(
            `SELECT * FROM subjects WHERE user_id = ?`,
            [user_id]
        );
        res.send(subjects);
    } catch (error) {
        res.send(error.message);
    }
})

app.delete('/subject/:subject_id', async (req, res) => {
    try {
        const { subject_id } = req.params;
        await query(
            `DELETE FROM subjects WHERE subject_id = ?`,
            [subject_id]
        );
        res.send({ success: true });
    } catch (error) {
        res.send(error.message);
    }
})

app.post('/topic', async (req, res) => {
    try {
        const { topicName, subject_id } = req.body;
        await query(
            `INSERT INTO topics(topic_name, subject_id) VALUES(?,?)`,
            [topicName, subject_id]
        );
        res.send({ success: true });
    } catch (error) {
        res.send(error.message);
    }
})

app.get('/topic', async (req, res) => {
    try {
        const { subject_id } = req.query;
        const topics = await query(
            `SELECT * FROM topics WHERE subject_id = ?`,
            [subject_id]
        );
        res.send(topics);
    } catch (error) {
        res.send(error.message);
    }
})

app.delete('/topic/:topic_id', async (req, res) => {
    try {
        const { topic_id } = req.params;
        await query(
            `DELETE FROM topics WHERE topic_id = ?`,
            [topic_id]
        );
        res.send({ success: true });
    } catch (error) {
        res.send(error.message);
    }
})


app.post('/flashcard', async (req, res) => {
    try {
        const { topic_id, question, answer } = req.body;
        await query(
            `INSERT INTO flashcards(topic_id, question, answer) VALUES(?, ?, ?)`,
            [topic_id, question, answer]
        );
        res.send({ success: true });
    } catch (error) {
        res.send(error.message);
    }
})

app.get('/flashcard', async (req, res) => {
    try {
        const { topic_id } = req.query;
        const flashcards = await query(
            `SELECT * FROM flashcards WHERE topic_id = ?`,
            [topic_id]
        );
        res.send(flashcards);
    } catch (error) {
        res.send(error.message);
    }
})

app.delete('/flashcard/:flashcard_id', async (req, res) => {
    try {
        const { flashcard_id } = req.params;
        await query(
            `DELETE FROM flashcards WHERE flashcard_id = ?`,
            [flashcard_id]
        );
        res.send({ success: true });
    } catch (error) {
        res.send(error.message);
    }
})

app.listen(port, () => {
    db.connect((err) => {
        if (err) {
            console.log("DB Error", err.message);
        } else {
            console.log('MySQL connected');
            db.query(
                `CREATE TABLE IF NOT EXISTS user (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(100) NOT NULL
                )`, (err) => {
                if (err) throw err;
                console.log('User table created or already exists.');
            });
            db.query(
                `CREATE TABLE IF NOT EXISTS subjects (
                    subject_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    subject_name VARCHAR(100) NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES user(user_id)
                )`, (err) => {
                if (err) throw err;
                console.log('Subjects table created or already exists.');
            });
            db.query(
                `CREATE TABLE IF NOT EXISTS topics (
                    topic_id INT AUTO_INCREMENT PRIMARY KEY,
                    subject_id INT,
                    topic_name VARCHAR(100) NOT NULL,
                    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
                )`, (err) => {
                if (err) throw err;
                console.log('Topics table created or already exists.');
            });
            db.query(
                `CREATE TABLE IF NOT EXISTS flashcards (
                    flashcard_id INT AUTO_INCREMENT PRIMARY KEY,
                    topic_id INT,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
                )`, (err) => {
                if (err) throw err;
                console.log('Flashcards table created or already exists.');
            });
        }
    });
    console.log(`Example app listening on port ${port}`);
})


