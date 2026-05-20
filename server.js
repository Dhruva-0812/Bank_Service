const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'bankdb'
});

// Register
app.post('/register',(req,res)=>{
    const data = req.body;

    if(data.password !== data.cpassword){
        return res.send('Passwords do not match');
    }

    db.query(
        'INSERT INTO users(fname,lname,phone,address,email,username,password) VALUES(?,?,?,?,?,?,?)',
        [data.fname,data.lname,data.phone,data.address,data.email,data.username,data.password],
        (err)=>{
                    if(err) return res.send('Username already exists');
            res.send('Account Created');
        }
    );
});

// Login
app.post('/login',(req,res)=>{
    db.query(
        'SELECT * FROM users WHERE username=? AND password=?',
        [req.body.username,req.body.password],
        (err,result)=>{
            if(result.length>0)
                res.send(result[0]);
            else
                res.send('Invalid Login');
        }
    );
});
// Account Details
app.get('/user/:username',(req,res)=>{
    db.query(
        'SELECT fname,lname,phone,address,email,username,balance FROM users WHERE username=?',
        [req.params.username],
        (err,result)=>{
            res.send(result[0]);
        }
    );
});

// Deposit
app.post('/deposit',(req,res)=>{
    const {username,amount} = req.body;

    db.query(
        'UPDATE users SET balance = balance + ? WHERE username=?',
        [amount,username]
    );

    db.query(
        'INSERT INTO transactions(username,type,amount) VALUES(?,?,?)',
        [username,'Deposit',amount]
    );

    res.send('Money Deposited');
});

// Withdraw
app.post('/withdraw',(req,res)=>{
    const {username,amount} = req.body;

    db.query(
        'SELECT balance FROM users WHERE username=?',
        [username],
        (err,result)=>{
            if(result[0].balance < amount){
                return res.send('Insufficient Balance');
            }

            db.query(
                'UPDATE users SET balance = balance - ? WHERE username=?',
                [amount,username]
            );

            db.query(
                'INSERT INTO transactions(username,type,amount) VALUES(?,?,?)',
                [username,'Withdraw',amount]
            );

            res.send('Money Withdrawn');
        }
    );
});

// Transaction History
app.get('/transactions/:username',(req,res)=>{
    db.query(
        'SELECT * FROM transactions WHERE username=? ORDER BY id DESC LIMIT 15',
        [req.params.username],
        (err,result)=>{
            res.send(result);
        }
    );
});

app.listen(3000,()=>{
    console.log('Server Running');
});
