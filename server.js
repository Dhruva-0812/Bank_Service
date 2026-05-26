const express=require('express'),mysql=require('mysql2'),cors=require('cors');
const app=express();
app.use(express.json(),cors(),express.static('public'));

const db=mysql.createConnection({
host:'localhost',user:'root',password:'123456',database:'bankdb'
});

const q=(sql,v=[])=>new Promise((r,j)=>db.query(sql,v,(e,d)=>e?j(e):r(d)));

app.post('/register',async(req,res)=>{
try{
await q('insert into users(fname,lname,phone,address,email,username,password,balance) values(?,?,?,?,?,?,?,0)',Object.values(req.body));
res.send('Registered Successfully');
}catch(e){res.send(e.message)}
});

app.post('/login',async(req,res)=>{
const {username,password}=req.body;
const d=await q('select * from users where username=? and password=?',[username,password]);
res.send(d.length?'success':'invalid');
});

app.get('/user/:u',async(req,res)=>{
const d=await q('select * from users where username=?',[req.params.u]);
res.json(d[0]);
});
app.post('/transaction',async(req,res)=>{
const {username,amount,type}=req.body;
const d=await q('select balance from users where username=?',[username]);
let b=d[0].balance;

if(type=='withdraw' && amount>b)
return res.send('Insufficient Balance');

b=type=='deposit'?b+ +amount:b- +amount;

await q('update users set balance=? where username=?',[b,username]);
await q('insert into transactions(username,type,amount) values(?,?,?)',[username,type,amount]);

res.send('Success');
});

app.get('/transactions/:u',async(req,res)=>{
const d=await q('select * from transactions where username=? order by id desc limit 15',[req.params.u]);
res.json(d);
});

app.listen(3000,()=>console.log('Server Running'));
