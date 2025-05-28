const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();

  const newTransaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(newTransaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
}

function removeTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  updateLocalStorage();
  renderTransactions();
}

function renderTransactions() {
  list.innerHTML = '';
  transactions.forEach(tx => {
    const sign = tx.amount < 0 ? '-' : '+';
    const li = document.createElement('li');
    li.classList.add(tx.amount < 0 ? 'minus' : 'plus');
    li.innerHTML = `
      ${tx.text} <span>${sign}₹${Math.abs(tx.amount).toFixed(2)}</span>
      <button class="delete-btn" onclick="removeTransaction(${tx.id})">x</button>
    `;
    list.appendChild(li);
  });
  updateSummary();
}

function updateSummary() {
  const amounts = transactions.map(tx => tx.amount);
  const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
  const incomeTotal = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expenseTotal = (
    amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeTotal}`;
  expense.innerText = `₹${expenseTotal}`;
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', addTransaction);

renderTransactions();
