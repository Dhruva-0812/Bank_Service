const api='http://localhost:3000';
const $=x=>document.getElementById(x);

async function login(){
let r=await fetch(api+'/login',{
method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({username:u.value,password:p.value})
});

r=await r.text();

if(r=='success'){
sessionStorage.setItem('u',u.value);
location='dashboard.html';
}
else alert('Invalid Login');
}

async function register(){
let d={
fname:fname.value,lname:lname.value,phone:phone.value,
address:address.value,email:email.value,
username:username.value,password:password.value
};

let r=await fetch(api+'/register',{
method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify(d)
});
alert(await r.text());
location='index.html';
}
