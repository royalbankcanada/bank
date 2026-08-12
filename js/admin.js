//======================================================
// ROYAL BANK CANADA
// ADMIN CUSTOMERS
//======================================================

const API_URL = "https://canada-1.onrender.com";

const table = document.getElementById("customerTable");
const search = document.getElementById("search");

let customers = [];

//==============================
// LOAD CUSTOMERS
//==============================

async function loadCustomers() {

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers`
        );

        const result = await response.json();

        if (result.success) {

            customers = result.customers;

            renderTable(customers);

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to load customers.");

    }

}

//==============================
// RENDER TABLE
//==============================

function renderTable(list) {

    table.innerHTML = "";

    list.forEach(customer => {

        table.innerHTML += `

<tr>

<td>${customer.customerId}</td>

<td>${customer.firstName} ${customer.lastName}</td>

<td>${customer.phone || "-"}</td>

<td>${customer.accessCode || "-"}</td>

<td>${customer.accountNumber}</td>

<td>${customer.balance} ${customer.currency}</td>

<td class="${customer.status === "Active"
? "status-active"
: "status-blocked"}">

${customer.status}

</td>

<td>

<div class="actions">

<button
class="edit"
onclick="editCustomer('${customer._id}')">
Edit
</button>

<button
class="credit"
onclick="creditCustomer('${customer._id}')">
Credit
</button>

<button
class="recharge"
onclick="rechargeCustomer('${customer._id}')">
Recharge
</button>

<button
class="password"
onclick="resetPassword('${customer._id}')">
Password
</button>

<button
class="${customer.status === "Active"
? "block"
: "activate"}"
onclick="toggleStatus('${customer._id}')">

${customer.status === "Active"
? "Block"
: "Activate"}

</button>

<button
class="delete"
onclick="deleteCustomer('${customer._id}')">
Delete
</button>

</div>

</td>

</tr>

`;

    });

}
//==============================
// SEARCH
//==============================

search.addEventListener("keyup", () => {

    const keyword = search.value.toLowerCase();

    const filtered = customers.filter(customer =>

        customer.customerId.toLowerCase().includes(keyword)

        ||

        customer.firstName.toLowerCase().includes(keyword)

        ||

        customer.lastName.toLowerCase().includes(keyword)

        ||

        (customer.phone || "").toLowerCase().includes(keyword)

        ||

         (customer.accessCode || "").toLowerCase().includes(keyword)
    );

    renderTable(filtered);

});

//==============================
// EDIT CUSTOMER
//==============================

async function editCustomer(id) {

    const firstName = prompt("First Name:");
    if (firstName === null) return;

    const lastName = prompt("Last Name:");
    if (lastName === null) return;

    const phone = prompt("Phone:");
    if (phone === null) return;

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Customer updated successfully.");

            loadCustomers();

        } else {

            alert(result.message);

        }

    } catch (error) {

        alert("Unable to update customer.");

    }

}

//==============================
// CREDIT ACCOUNT
//==============================

async function creditCustomer(id) {

    const amount = prompt("Enter amount to credit:");

    if (!amount) return;

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}/credit`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount
                })
            }
        );

        const result = await response.json();

        alert("New Balance : " + result.balance);

        loadCustomers();

    } catch (error) {

        alert("Unable to credit account.");

    }

}
//==============================
// RESET PASSWORD
//==============================

async function resetPassword(id) {

    const password = prompt("Enter new password:");

    if (!password) return;

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}/password`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert(result.message);

        } else {

            alert(result.message);

        }

    } catch (error) {

        alert("Unable to reset password.");

    }

}

//==============================
// BLOCK / ACTIVATE CUSTOMER
//==============================

async function toggleStatus(id) {

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}/status`,
            {
                method: "PUT"
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Status : " + result.status);

            loadCustomers();

        } else {

            alert(result.message);

        }

    } catch (error) {

        alert("Unable to update status.");

    }

}

//==============================
// DELETE CUSTOMER
//==============================

async function deleteCustomer(id) {

    if (!confirm("Delete this customer permanently?")) return;

    try {

        const response = await fetch(
            `${API_URL}/api/admin/customers/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Customer deleted successfully.");

            loadCustomers();

        } else {

            alert(result.message);

        }

    } catch (error) {

        alert("Unable to delete customer.");

    }

}

//==============================
// RECHARGE ACCOUNT
//==============================

function rechargeCustomer(id){

    window.location.href =
    `recharge.html?id=${id}`;

}

//==============================
// LOGOUT
//==============================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    window.location.href = "login.html";

}

//==============================
// START
//==============================

loadCustomers();
