async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const text = await res.text();

    try {
        const data = JSON.parse(text);
        if (data && data.username) {
            sessionStorage.setItem('currentUser', data.username);
            window.location.href = 'dashboard.html';
            return false;
        }
    } catch (_) {
        /* not JSON */
    }

    alert(text || 'Invalid login');
    return false;
}

async function handleRegister(e) {
    e.preventDefault();

    const data = {
        fname: document.getElementById('fname').value.trim(),
        lname: document.getElementById('lname').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        email: document.getElementById('email').value.trim(),
        username: document.getElementById('ruser').value.trim(),
        password: document.getElementById('rpass').value,
        cpassword: document.getElementById('cpass').value
    };

    const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const message = await res.text();
    alert(message);

    if (message === 'Account Created') {
        window.location.href = 'index.html';
    }

    return false;
}
