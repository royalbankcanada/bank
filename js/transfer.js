/*=========================================
  DEMO BANK
  transfer.js
=========================================*/

let currentUser = null;
let transfers = [];
let beneficiaries = [];

function loadUser() {

    const user = localStorage.getItem("currentUser");

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = JSON.parse(user);

}

function loadTransfers() {

    const data = localStorage.getItem("transfers");

    transfers = data ? JSON.parse(data) : [];

}

function saveTransfers() {

    localStorage.setItem(
        "transfers",
        JSON.stringify(transfers)
    );

}

function saveCurrentUser() {

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

}

function formatMoney(amount) {

    return Number(amount).toLocaleString("en-CA", {

        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    });

}

function updateBalance() {

    const balance = document.getElementById("availableBalance");

    if (balance) {

        balance.textContent = "$ " + formatMoney(currentUser.balance);

    }

    const summary = document.getElementById("summaryBalance");

    if (summary) {

        summary.textContent = "$ " + formatMoney(currentUser.balance);

    }

}

function showMessage(message, color = "#0b8f45") {

    alert(message);

}

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadTransfers();

    updateBalance();

});
/*=========================================
  VALIDATION DU FORMULAIRE
=========================================*/

function getFormData() {

    return {

        sender: document.getElementById("senderAccount").value.trim(),
        beneficiary: document.getElementById("beneficiaryName").value.trim(),
        account: document.getElementById("beneficiaryAccount").value.trim(),
        bank: document.getElementById("bank").value,
        currency: document.getElementById("currency").value,
        amount: parseFloat(document.getElementById("amount").value),
        reason: document.getElementById("reason").value.trim(),
        code: document.getElementById("accessCode").value.trim()

    };

}

function validateTransfer(data) {

    if (!data.beneficiary) {

        showMessage("Veuillez saisir le nom du bénéficiaire.");
        return false;

    }

    if (!data.account) {

        showMessage("Veuillez saisir le numéro de compte.");
        return false;

    }

    if (!data.bank) {

        showMessage("Veuillez sélectionner une banque.");
        return false;

    }

    if (isNaN(data.amount) || data.amount <= 0) {

        showMessage("Veuillez saisir un montant valide.");
        return false;

    }

    if (data.amount > currentUser.balance) {

        showMessage("Solde insuffisant.");
        return false;

    }

    if (data.code.length < 4) {

        showMessage("Code d'accès invalide.");
        return false;

    }

    return true;

}

function clearForm() {

    document.getElementById("beneficiaryName").value = "";
    document.getElementById("beneficiaryAccount").value = "";
    document.getElementById("bank").selectedIndex = 0;
    document.getElementById("currency").selectedIndex = 0;
    document.getElementById("amount").value = "";
    document.getElementById("reason").value = "";
    document.getElementById("accessCode").value = "";

}

function cancelTransfer() {

    if (confirm("Voulez-vous vraiment annuler ce virement ?")) {

        clearForm();

    }

}
/*=========================================
  APERÇU DU VIREMENT
=========================================*/

function previewTransfer() {

    const data = getFormData();

    if (!validateTransfer(data)) {

        return;

    }

    document.getElementById("confirmBeneficiary").textContent = data.beneficiary;
    document.getElementById("confirmAccount").textContent = data.account;
    document.getElementById("confirmBank").textContent = data.bank;
    document.getElementById("confirmCurrency").textContent = data.currency;
    document.getElementById("confirmAmount").textContent =
        data.currency + " " + formatMoney(data.amount);
    document.getElementById("confirmReason").textContent =
        data.reason || "-";

    const section = document.getElementById("confirmationSection");

    if (section) {

        section.scrollIntoView({

            behavior: "smooth"

        });

    }

}

function generateReference() {

    return "TRX-" +
        Date.now().toString().slice(-8) +
        "-" +
        Math.floor(Math.random() * 9000 + 1000);

}

function getCurrentDate() {

    return new Date().toLocaleString("fr-FR");

}
/*=========================================
  APERÇU DU VIREMENT
=========================================*/

function previewTransfer() {

    const data = getFormData();

    if (!validateTransfer(data)) {

        return;

    }

    document.getElementById("confirmBeneficiary").textContent = data.beneficiary;
    document.getElementById("confirmAccount").textContent = data.account;
    document.getElementById("confirmBank").textContent = data.bank;
    document.getElementById("confirmCurrency").textContent = data.currency;
    document.getElementById("confirmAmount").textContent =
        data.currency + " " + formatMoney(data.amount);
    document.getElementById("confirmReason").textContent =
        data.reason || "-";

    const section = document.getElementById("confirmationSection");

    if (section) {

        section.scrollIntoView({

            behavior: "smooth"

        });

    }

}

function generateReference() {

    return "TRX-" +
        Date.now().toString().slice(-8) +
        "-" +
        Math.floor(Math.random() * 9000 + 1000);

}

function getCurrentDate() {

    return new Date().toLocaleString("fr-FR");

}
/*=========================================
  GÉNÉRATION DU REÇU
=========================================*/

function displayReceipt(transfer) {

    const receipt = document.getElementById("receipt");

    if (!receipt) {

        return;

    }

    receipt.classList.add("active");

    document.getElementById("receiptReference").textContent = transfer.id;

    document.getElementById("receiptDate").textContent = transfer.date;

    document.getElementById("receiptSender").textContent =
        transfer.sender;

    document.getElementById("receiptBeneficiary").textContent =
        transfer.beneficiary;

    document.getElementById("receiptAccount").textContent =
        transfer.beneficiaryAccount;

    document.getElementById("receiptBank").textContent =
        transfer.bank;

    document.getElementById("receiptAmount").textContent =
        transfer.currency + " " + formatMoney(transfer.amount);

    document.getElementById("receiptStatus").textContent =
        transfer.status;

    receipt.scrollIntoView({

        behavior: "smooth"

    });

}

function downloadReceipt() {

    window.print();

}

function closeReceipt() {

    const receipt = document.getElementById("receipt");

    if (receipt) {

        receipt.classList.remove("active");

    }

}
/*=========================================
  GESTION DES BÉNÉFICIAIRES
=========================================*/

function addBeneficiary(name, account, bank) {

    const exists = beneficiaries.find(item => item.account === account);

    if (exists) {

        return;

    }

    beneficiaries.push({

        name: name,
        account: account,
        bank: bank

    });

    localStorage.setItem(
        "beneficiaries",
        JSON.stringify(beneficiaries)
    );

}

function loadBeneficiaries() {

    const data = localStorage.getItem("beneficiaries");

    beneficiaries = data ? JSON.parse(data) : [];

}

function selectBeneficiary(name, account, bank) {

    document.getElementById("beneficiaryName").value = name;
    document.getElementById("beneficiaryAccount").value = account;
    document.getElementById("bank").value = bank;

    showMessage("Bénéficiaire sélectionné.");

}

function saveCurrentBeneficiary() {

    const data = getFormData();

    if (!data.beneficiary || !data.account || !data.bank) {

        showMessage("Complétez les informations du bénéficiaire.");
        return;

    }

    addBeneficiary(
        data.beneficiary,
        data.account,
        data.bank
    );

    showMessage("Bénéficiaire enregistré.");

}

document.addEventListener("DOMContentLoaded", () => {

    loadBeneficiaries();

});
/*=========================================
  HISTORIQUE DES VIREMENTS
=========================================*/

function renderTransferHistory() {

    const tbody = document.getElementById("historyBody");

    if (!tbody) {

        return;

    }

    tbody.innerHTML = "";

    if (transfers.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    Aucun virement disponible.
                </td>
            </tr>
        `;

        return;

    }

    transfers.forEach(transfer => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${transfer.date}</td>

            <td>${transfer.beneficiary}</td>

            <td>${transfer.currency} ${formatMoney(transfer.amount)}</td>

            <td>
                <span class="badge success">
                    ${transfer.status}
                </span>
            </td>

        `;

        tbody.appendChild(row);

    });

}

function searchTransfers(keyword) {

    keyword = keyword.toLowerCase();

    const rows = document.querySelectorAll("#historyBody tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(keyword)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}

document.addEventListener("DOMContentLoaded", () => {

    renderTransferHistory();

});
/*=========================================
  MISE À JOUR DU RÉSUMÉ
=========================================*/

function updateTransferSummary() {

    const amount =
        parseFloat(document.getElementById("amount").value) || 0;

    const currency =
        document.getElementById("currency").value;

    document.getElementById("summaryAmount").textContent =
        currency + " " + formatMoney(amount);

    const fees = amount > 0 ? amount * 0.01 : 0;

    document.getElementById("summaryFees").textContent =
        currency + " " + formatMoney(fees);

    const total = amount + fees;

    document.getElementById("summaryTotal").textContent =
        currency + " " + formatMoney(total);

}

function attachSummaryEvents() {

    const amount = document.getElementById("amount");
    const currency = document.getElementById("currency");

    if (amount) {

        amount.addEventListener("input", updateTransferSummary);

    }

    if (currency) {

        currency.addEventListener("change", updateTransferSummary);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    attachSummaryEvents();

    updateTransferSummary();

});
/*=========================================
  LIMITES DE VIREMENT
=========================================*/

const transferLimits = {

    daily: 10000,
    monthly: 50000,
    minimum: 10

};

function checkTransferLimits(amount) {

    if (amount < transferLimits.minimum) {

        showMessage(
            "Le montant minimum autorisé est de " +
            formatMoney(transferLimits.minimum)
        );

        return false;

    }

    if (amount > transferLimits.daily) {

        showMessage(
            "Vous dépassez la limite journalière de " +
            formatMoney(transferLimits.daily)
        );

        return false;

    }

    return true;

}

function calculateFees(amount) {

    if (amount <= 1000) {

        return 5;

    }

    if (amount <= 5000) {

        return 10;

    }

    return amount * 0.01;

}

function updateFees() {

    const amount = parseFloat(
        document.getElementById("amount").value
    ) || 0;

    const currency =
        document.getElementById("currency").value;

    const fees = calculateFees(amount);

    document.getElementById("summaryFees").textContent =
        currency + " " + formatMoney(fees);

    document.getElementById("summaryTotal").textContent =
        currency + " " + formatMoney(amount + fees);

}

document.addEventListener("DOMContentLoaded", () => {

    const amountField = document.getElementById("amount");

    if (amountField) {

        amountField.addEventListener("input", updateFees);

    }

});
/*=========================================
  ACTUALISATION DU TABLEAU DE BORD
=========================================*/

function updateDashboardData() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(user => user.account === currentUser.account);

    if (index !== -1) {

        users[index] = currentUser;

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }

}

function saveTransferToAccount(transfer) {

    let history = JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

    history.unshift({

        id: transfer.id,
        type: "Transfer",
        date: transfer.date,
        description: "Transfer to " + transfer.beneficiary,
        amount: -transfer.amount,
        currency: transfer.currency,
        status: transfer.status

    });

    localStorage.setItem(
        "transactions",
        JSON.stringify(history)
    );

}

function completeTransfer(transfer) {

    updateDashboardData();

    saveTransferToAccount(transfer);

    renderTransferHistory();

    updateBalance();

}
/*=========================================
  INITIALISATION
=========================================*/

function initializeTransferPage() {

    loadUser();

    loadTransfers();

    loadBeneficiaries();

    updateBalance();

    renderTransferHistory();

    updateTransferSummary();

}

document.addEventListener("DOMContentLoaded", () => {

    initializeTransferPage();

    const form = document.getElementById("transferForm");

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            previewTransfer();

        });

    }

    const amountField = document.getElementById("amount");

    if (amountField) {

        amountField.addEventListener("input", function () {

            updateTransferSummary();
            updateFees();

        });

    }

    const currencyField = document.getElementById("currency");

    if (currencyField) {

        currencyField.addEventListener("change", function () {

            updateTransferSummary();
            updateFees();

        });

    }

});
/*=========================================
  FONCTIONS FINALES
=========================================*/

function resetTransferForm() {

    clearForm();

    updateTransferSummary();

    updateFees();

    const confirmation = document.getElementById("confirmationSection");

    if (confirmation) {

        confirmation.scrollIntoView({

            behavior: "smooth"

        });

    }

}

function logout() {

    if (confirm("Voulez-vous vous déconnecter ?")) {

        localStorage.removeItem("currentUser");

        window.location.href = "login.html";

    }

}

window.addEventListener("storage", function () {

    loadUser();

    updateBalance();

    renderTransferHistory();

});

window.onload = function () {

    initializeTransferPage();

    console.log("Demo Bank - Transfer Module Loaded");

};
