const transactionform = document.getElementById("transaction-form");

const descriptioninput = document.getElementById("description");
const amountinput = document.getElementById("amount");
const categoryinput = document.getElementById("category");
const typeinput = document.getElementById("type");
const dateinput = document.getElementById("date");

const totalincome = document.getElementById("total-income");
const totalexpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");

const transactionlist = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {style: "currency", currency: "INR"}).format(amount);
}

transactionform.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptioninput.value.trim();
    const amount = Number(amountinput.value);
    const category = categoryinput.value;
    const type = typeinput.value;
    const date = dateinput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0 || !category || !type || !date) {
        alert("Please enter valid transaction details.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        category: category,
        type: type,
        date: date
    };

    transactions.push(transaction);
    savetransactions();
    displaytransactions();
    transactionform.reset();
});

function savetransactions() {
    localStorage.setItem ("transactions", JSON.stringify(transactions));
}

function displaytransactions() {
    transactionlist.innerHTML = "";
    
    if (transactions.length === 0) {
        transactionlist.innerHTML = "<p>No transactions added yet.</p>";
        updateDashboard();
        return;
    }

    transactions.forEach(function (transaction) {
        const item = document.createElement("div");
        item.classList.add("transaction-item");

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = transaction.description;

        const info = document.createElement("p");
        info.textContent = transaction.category + " | " + transaction.date;

        details.appendChild(name);
        details.appendChild(info);

        const amount = document.createElement("span");

        amount.textContent = (transaction.type === "income" ? "+" : "-") +
            formatCurrency(transaction.amount);

        amount.classList.add(transaction.type);

        const deletebutton = document.createElement("button");
        deletebutton.textContent = "Delete";
        deletebutton.addEventListener("click", function() {
            deletetransaction(transaction.id);
        });

        item.appendChild(details);
        item.appendChild(amount);
        item.appendChild(deletebutton);

        transactionlist.appendChild(item); 
    });

    updateDashboard();
}

function updateDashboard() {
    let income = 0;
    let expense = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        
        } else {
            expense += transaction.amount;
        }
    });

    const availablebalance = income - expense;

    totalincome.textContent = formatCurrency(income);
    totalexpense.textContent = formatCurrency(expense);
    balance.textContent = formatCurrency(availablebalance);
}

function deletetransaction(id) {
    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    savetransactions();
    displaytansactions();
}

displaytansactions();