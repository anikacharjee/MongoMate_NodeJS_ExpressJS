const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/UserDB')
.then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/public/form.html');
});

app.post('/submit', async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).send('Username and Email are required');
    }

    try {
        const newUser = new User({ username, email });
        await newUser.save();
        // res.send(`Data saved successfully! Username: ${username}, Email: ${email}`);
        res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Submission Status</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f3f3f3;
                            text-align: center;
                            padding-top: 60px;
                        }
                        .container {
                            background-color: #fff;
                            padding: 30px 40px;
                            margin: auto;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                            display: inline-block;
                        }
                        h2 {
                            color: green;
                        }
                        p {
                            font-size: 18px;
                            color: #333;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2> Data Saved Successfully!</h2>
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Email:</strong> ${email}</p>
                    </div>
                </body>
                </html>
      `);

    } catch (error) {
        res.status(500).send('Error saving data');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
