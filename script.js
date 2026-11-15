
// Load the sidebar content from an external HTML file
fetch("sidebar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("sidebar").innerHTML = data;
    });



// Transaction type options
const transactionTypes = [
    "Income",
    "Expenses",
];

// Get the select element
const transactionSelect = document.getElementById("transaction-type");
const transactionSubCategorySelect = document.getElementById("transaction-sub-category");


// Loop through the array for transaction type
transactionTypes.forEach(type => {

    // Create an option element
    const option = document.createElement("option");

    // Set the option value
    option.value = type.toLowerCase();

    // Set the visible text
    option.textContent = type;

    // Append option to select
    transactionSelect.appendChild(option);

});


// Expense categories
const expenseCategories = [
    "Food",
    "Transport",
    "Housing",
    "Bills",
    "Shopping",
    "Health",
    "Fun",
    "Other"
];

// Income categories
const incomeCategories = [
    "Salary",
    "Business",
    "Investments",
    "Gifts",
    "Side Hustle",
    "Other"
];


// Loop through the array for transaction sub categories
function updateCategorySelect() {
    const currentFilter = transactionSelect.value;

    // Clear previously generated options
    transactionSubCategorySelect.innerHTML = "";

    // Transaction condition depending on which transaction type
    if (currentFilter === "income") {

        incomeCategories.forEach(category => {

            // Create an option element
            const option = document.createElement("option");

            // Set the option value
            option.value = category.toLowerCase();

            // Set the visible text
            option.textContent = category;

            // Append option to select
            transactionSubCategorySelect.appendChild(option);

        });

    }
    else {

        // Loop through the array for expense categories
        expenseCategories.forEach(category => {

            // Create an option element
            const option = document.createElement("option");

            // Set the option value
            option.value = category.toLowerCase();

            // Set the visible text
            option.textContent = category;

            // Append option to select
            transactionSubCategorySelect.appendChild(option);

        });
    }
}

transactionSelect.addEventListener("change", updateCategorySelect);

updateCategorySelect();


/* Handle form submission */
// Get form and input elements
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionTypeSelect = document.getElementById("transaction-type");
const transactSubCategory = document.getElementById("transaction-sub-category");
const dateInput = document.getElementById("date-picker");

const transactionList = document.querySelector(".transaction-list");

const filterContent = document.querySelector(".filter-content");
const filterSection = document.querySelector(".filter-section");


// Transaction array list
let transactions = [];

let currentFilter = "all";

// Get values after form submission
transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value.trim());
    const transactionType = transactionTypeSelect.value;
    const transactionSubCategorySelect = transactSubCategory.value;
    const date = dateInput.value;

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        transactionType: transactionType,
        transactionSubCategorySelect: transactionSubCategorySelect,
        date: date
    };

    transactions.push(transaction);

    displayTransactions();
    transactionForm.reset();
    updateCategorySelect();
    updateTransactionSummary();

});


// Get Total Entries, Incomes & Expenses
const totalIncomeDisplay = document.getElementById("total-income");
const totalSpentDisplay = document.getElementById("total-spent");
const totalEntriesDisplay = document.getElementById("total-entries");

function updateTransactionSummary() {

    let totalIncome = 0;
    let totalSpent = 0;
    let totalEntries = transactions.length;

    transactions.forEach(transaction => {

        if (transaction.transactionType === "income") {

            totalIncome += Number(transaction.amount);

        } else if (transaction.transactionType === "expenses") {

            totalSpent += Number(transaction.amount);

        }

    });

    totalEntriesDisplay.textContent = totalEntries;

    totalIncomeDisplay.textContent =
        totalIncome.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP"
        });

    totalSpentDisplay.textContent =
        totalSpent.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP"
        });

}




// filter transactions dropdown based on type
function createTransactionFilter() {

    const filterTransactionType = document.createElement("select");
    filterTransactionType.id = "filter-transaction-type";
    filterTransactionType.classList.add("filter-transaction-type");

    const options = ["all", "income", "expenses"];

    options.forEach(type => {

        const option = document.createElement("option");

        option.value = type;
        option.textContent = type;

        filterTransactionType.appendChild(option);

    });

    // Filter functionality
    filterTransactionType.addEventListener("change", function () {

        currentFilter = filterTransactionType.value;

        const filteredTransactions = transactions.filter(transaction => {

            if (currentFilter === "all") {
                return true;
            }

            return transaction.transactionType === currentFilter;

        });

        displayTransactions(filteredTransactions);

    });

    filterContent.appendChild(filterTransactionType);
}

// Delete transaction function filter
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => {
        return transaction.id !== id;
    });
    
    // Apply the current filter again
    const filteredTransactions = transactions.filter(transaction => {

        if (currentFilter === "all") {
            return true;
        }

        return transaction.transactionType === currentFilter;

    });

    // Update the displayed transactions
    displayTransactions(filteredTransactions);

    updateTransactionSummary();
}


// Display transactions in the transaction list
function displayTransactions(transactionData = transactions) {

    // Show filter only when there are 2 or more transactions
    if (transactions.length >= 2) {
        filterSection.style.display = "block";
    } else {
        filterSection.style.display = "none";
    }
    transactionList.innerHTML = "";

    transactionData.forEach(transaction => {

        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction-item");

        // Item list id
        transactionItem.dataset.id = transaction.id;


        //Left section item list element
        const transactionDetails = document.createElement("div");
        transactionDetails.classList.add("transaction-details");

        const description = document.createElement("h3");
        description.classList.add("transaction-description");
        description.textContent = `${transaction.description}`;

        const transactionMeta = document.createElement("div");
        transactionMeta.classList.add("transaction-meta");

        const transactionSubCategorySelect = document.createElement("span");
        transactionSubCategorySelect.classList.add("transaction-sub-category");
        transactionSubCategorySelect.textContent = `${transaction.transactionSubCategorySelect}`;

        const date = document.createElement("span");
        date.classList.add("transaction-date");
        date.textContent = `${transaction.date}`;

        transactionMeta.appendChild(transactionSubCategorySelect);
        transactionMeta.appendChild(date);

        transactionDetails.appendChild(description);
        transactionDetails.appendChild(transactionMeta);


        //Right section item option
        const transactionOption = document.createElement("div");
        transactionOption.classList.add("transaction-option");


        const amount = document.createElement("p");
        const deleteBtn = document.createElement("button");

        amount.classList.add("transaction-amount");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";

        transactionOption.appendChild(amount);
        transactionOption.appendChild(deleteBtn);

        // Delete each item by clicking the button
        deleteBtn.addEventListener("click", function () {
            deleteTransaction(transaction.id);
        });


        const formattedAmount = Number(transaction.amount).toLocaleString("en-PH");

        // Amount per item
        if (transaction.transactionType === "income") {
            amount.classList.add("income");
            amount.textContent = `+₱ ${formattedAmount}`;
        } else {
            amount.classList.add("expense");
            amount.textContent = `-₱ ${formattedAmount}`;
        }

        // Append both sections
        transactionItem.appendChild(transactionDetails);
        transactionItem.appendChild(transactionOption);
        transactionList.appendChild(transactionItem);
    });

}
createTransactionFilter();


