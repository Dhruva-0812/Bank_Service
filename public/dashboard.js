const panelTitles = {
    details: 'Account Details',
    transfer: 'Deposit & Withdraw',
    history: 'Transaction History'
};

let currentUser = '';

function formatBalance(amount) {
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function requireAuth() {
    currentUser = sessionStorage.getItem('currentUser') || '';
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    document.getElementById('displayUser').textContent = currentUser;
    return true;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showPanel(name) {
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));

    document.getElementById(`panel-${name}`).classList.add('active');
    document.querySelector(`.nav-btn[data-panel="${name}"]`).classList.add('active');
    document.getElementById('pageTitle').textContent = panelTitles[name] || name;

    if (name === 'details') loadDetails();
    if (name === 'transfer') loadTransferBalance();
    if (name === 'history') loadHistory();
}

async function refreshBalance() {
    const res = await fetch(`/user/${currentUser}`);
    const d = await res.json();
    const formatted = formatBalance(d.balance);

    const detailsBal = document.getElementById('balanceDisplay');
    const transferBal = document.getElementById('transferBalanceDisplay');
    if (detailsBal) detailsBal.textContent = formatted;
    if (transferBal) transferBal.textContent = formatted;

    return d;
}

async function loadTransferBalance() {
    await refreshBalance();
}

async function loadDetails() {
    const d = await refreshBalance();

    document.getElementById('detailsGrid').innerHTML = `
        <div class="detail-item"><label>First Name</label><span>${escapeHtml(d.fname)}</span></div>
        <div class="detail-item"><label>Last Name</label><span>${escapeHtml(d.lname)}</span></div>
        <div class="detail-item"><label>Phone</label><span>${escapeHtml(d.phone)}</span></div>
        <div class="detail-item detail-item-full"><label>Email</label><span>${escapeHtml(d.email)}</span></div>
        <div class="detail-item" style="grid-column:1/-1"><label>Address</label><span>${escapeHtml(d.address)}</span></div>
        <div class="detail-item"><label>Username</label><span>${escapeHtml(d.username)}</span></div>
    `;
}

function getTxAmount() {
    const input = document.getElementById('txAmount');
    const amount = input.value.trim();
    if (!amount || Number(amount) <= 0) {
        alert('Please enter a valid amount');
        return null;
    }
    return amount;
}

async function handleDeposit() {
    const amount = getTxAmount();
    if (!amount) return;

    const res = await fetch('/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, amount })
    });

    alert(await res.text());
    document.getElementById('txAmount').value = '';
    await refreshBalance();
}

async function handleWithdraw() {
    const amount = getTxAmount();
    if (!amount) return;

    const res = await fetch('/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, amount })
    });

    alert(await res.text());
    document.getElementById('txAmount').value = '';
    await refreshBalance();
}

async function loadHistory() {
    const wrap = document.getElementById('historyTableWrap');
    const res = await fetch(`/transactions/${currentUser}`);
    const data = await res.json();

    if (!data || data.length === 0) {
        wrap.innerHTML = '<p class="empty-state">No transactions yet.</p>';
        return;
    }

    let rows = '';
    data.forEach((t) => {
        const badgeClass = t.type === 'Deposit' ? 'badge-deposit' : 'badge-withdraw';
        rows += `<tr>
            <td><span class="badge ${badgeClass}">${escapeHtml(t.type)}</span></td>
            <td>₹${Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>${escapeHtml(t.date || '—')}</td>
        </tr>`;
    });

    wrap.innerHTML = `
        <table class="transactions-table">
            <thead>
                <tr><th>Type</th><th>Amount</th><th>Date</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;

    document.querySelectorAll('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => showPanel(btn.dataset.panel));
    });

    showPanel('details');
});
