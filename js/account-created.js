//======================================================
// ROYAL BANK CANADA
// ACCOUNT CREATED
//======================================================

const account = JSON.parse(sessionStorage.getItem("newAccount"));

if (!account) {
    window.location.href = "open-account.html";
}

document.getElementById("customerId").textContent =
    account.customerId;

document.getElementById("accountNumber").textContent =
    account.accountNumber;

document.getElementById("transitNumber").textContent =
    account.transitNumber;

document.getElementById("institutionNumber").textContent =
    account.institutionNumber;
