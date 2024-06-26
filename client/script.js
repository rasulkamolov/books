document.addEventListener("DOMContentLoaded", function () {
    fetchInventory();
    fetchDailyStatistics();
    updateCurrentDateDisplay();

    document.getElementById("inventoryForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const action = event.submitter.dataset.action;
        const bookName = document.getElementById("bookName").value;
        const quantity = parseInt(document.getElementById("quantity").value);
        if (action === "add") {
            addBook(bookName, quantity);
        } else if (action === "sell") {
            sellBook(bookName, quantity);
        }
    });
});

const bookPrices = {
    "Beginner": 85000,
    "Elementary": 85000,
    "Pre-Intermediate": 85000,
    "Intermediate": 85000,
    "Kids Level 1": 60000,
    "Kids Level 2": 60000,
    "Kids Level 3": 60000,
    "Kids Level 4": 60000,
    "Kids Level 5": 60000,
    "Kids Level 6": 60000,
    "Kids High Level 1": 60000,
    "Kids High Level 2": 60000,
    "Listening Beginner": 30000,
    "Listening Elementary": 30000,
    "Listening Pre-Intermediate": 30000,
    "Listening Intermediate": 35000
};

async function fetchInventory() {
    const response = await fetch("/books/inventory");
    const inventory = await response.json();
    displayInventory(inventory);
}

function displayInventory(inventory) {
    const inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = "";
    let totalValue = 0;

    for (const [bookName, quantity] of Object.entries(inventory)) {
        const value = quantity * bookPrices[bookName];
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.innerHTML = `${bookName}: ${formatNumber(quantity)} copies (Value: ${formatNumber(value)} UZS)`;
        inventoryList.appendChild(listItem);
        totalValue += value;
    }

    const totalItem = document.createElement("li");
    totalItem.className = "list-group-item";
    totalItem.innerHTML = `<strong>Total Inventory Value: ${formatNumber(totalValue)} UZS</strong>`;
    inventoryList.appendChild(totalItem);
}

async function addBook(bookName, quantity) {
    await fetch("/books/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bookName, quantity })
    });
    fetchInventory();
    fetchDailyStatistics();
}

async function sellBook(bookName, quantity) {
    await fetch("/books/sell", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bookName, quantity })
    });
    fetchInventory();
    fetchDailyStatistics();
}

async function fetchDailyStatistics() {
    const currentDate = localStorage.getItem("currentDate") || new Date().toLocaleDateString();
    const response = await fetch(`/stats/daily?date=${currentDate}`);
    const dailyStats = await response.json();
    displayDailyStatistics(dailyStats);
}

function displayDailyStatistics(dailyStats) {
    const dailyStatisticsList = document.getElementById("dailyStatistics");
    dailyStatisticsList.innerHTML = "";

    if (dailyStats.length === 0) {
        dailyStatisticsList.innerHTML = "<p class='list-group-item'>No statistics for today.</p>";
    } else {
        const list = document.createElement("ul");
        list.className = "list-group list-group-flush";
        let totalSoldValue = 0;

        dailyStats.forEach(stat => {
            const totalValue = stat.quantity * bookPrices[stat.bookName];
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.innerHTML = `${stat.timestamp}: ${stat.quantity} copies of "${stat.bookName}" ${stat.action} (${stat.quantity} x ${formatNumber(bookPrices[stat.bookName])} = ${formatNumber(totalValue)} UZS)`;
            list.appendChild(listItem);
            if (stat.action === "sell") {
                totalSoldValue += totalValue;
            }
        });

        const totalItem = document.createElement("li");
        totalItem.className = "list-group-item";
        totalItem.innerHTML = `<strong>Total Sold Today: ${formatNumber(totalSoldValue)} UZS</strong>`;
        list.appendChild(totalItem);
        dailyStatisticsList.appendChild(list);
    }
}

function updateCurrentDateDisplay() {
    const currentDate = localStorage.getItem("currentDate") || new Date().toLocaleDateString();
    document.getElementById("currentDate").textContent = `Current Date: ${currentDate}`;
}

function showPreviousDate() {
    let currentDate = localStorage.getItem("currentDate");
    if (!currentDate) return;
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() - 1);
    localStorage.setItem("currentDate", currentDate.toLocaleDateString());
    updateCurrentDateDisplay();
    fetchDailyStatistics();
}

function showNextDate() {
    let currentDate = localStorage.getItem("currentDate");
    if (!currentDate) return;
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
    localStorage.setItem("currentDate", currentDate.toLocaleDateString());
    updateCurrentDateDisplay();
    fetchDailyStatistics();
}

function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

function exportToPDF() {
    const doc = new jsPDF();
    const inventoryHTML = document.getElementById("inventoryList").innerHTML;
    const dailyStatsHTML = document.getElementById("dailyStatistics").innerHTML;
    const exportDate = new Date().toLocaleString();

    doc.text("Harvard School - Inventory and Statistics", 15, 15);
    doc.text(`Exported on: ${exportDate}`, 15, 25);

    doc.setFont("helvetica");
    doc.setFontSize(12);

    doc.text("Current Inventory", 15, 40);
    doc.fromHTML(inventoryHTML, 15, 45);

    doc.text("Today's Statistics", 15, doc.autoTable.previous.finalY + 10);
    doc.fromHTML(dailyStatsHTML, 15, doc.autoTable.previous.finalY + 15);

    doc.save(`Harvard_School_Inventory_${exportDate.replace(/\D/g, '')}.pdf`);
}

function openInventoryForm() {
    const modal = new bootstrap.Modal(document.getElementById("inventoryModal"));
    modal.show();
}
