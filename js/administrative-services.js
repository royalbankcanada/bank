/*==================================================
CANADA GLOBAL BANK
administrative services
PART 1 / 4
==================================================*/

const administrativeFees = {

    "Permanent Residence":1250,

    "Work Permit":180,

    "Study Permit":150,

    "Language test Fees":150,

    "Biometrics":85,

    "Administrative Fees":220

};

const paymentOptions = {

    BJ:["MTN","MOOV","CELTIIS","CORIS","VISA","MASTERCARD"],

    BF:["ORANGE","MOOV","WAVE","VISA","MASTERCARD"],

    CI:["MTN","ORANGE","MOOV","WAVE","VISA","MASTERCARD"],

    ML:["ORANGE","MOBICASH","VISA","MASTERCARD"],

    SN:["ORANGE","FREE","WAVE","VISA","MASTERCARD"],

    TG:["TOGOCOM","MOOV","VISA","MASTERCARD"],

    CG:["MTN","VISA","MASTERCARD"],

    CM:["MTN"],

    GA:["AIRTEL"],

    CD:["AIRTEL","ORANGE","VODACOM"],

    GH:["MTN","AIRTELTIGO"],

    GN:["MTN","ORANGE"],

    NG:["MTN"],

    GM:["AFRIMONEY"],

    TD:["AIRTEL","MOOV"]

};

const paymentAggregator = {

    BJ:"FEEXPAY",
    BF:"FEEXPAY",
    CI:"FEEXPAY",
    ML:"FEEXPAY",
    SN:"FEEXPAY",
    TG:"FEEXPAY",
    CG:"FEEXPAY",

    CM:"PAWAPAY",
    GA:"PAWAPAY",
    CD:"PAWAPAY",
    GH:"PAWAPAY",
    GN:"PAWAPAY",
    NG:"PAWAPAY",
    GM:"PAWAPAY",
    TD:"PAWAPAY"

};

const form=document.getElementById("administrativeForm");

const service=document.getElementById("service");

const country=document.getElementById("country");

const countryCode=document.getElementById("countryCode");

const countryCodes={

BJ:"+229",

BF:"+226",

CI:"+225",

CG:"+242",

ML:"+223",

SN:"+221",

TG:"+228",

CM:"+237",

GA:"+241",

CD:"+243",

GH:"+233",

GN:"+224",

NG:"+234",

GM:"+220",

TD:"+235"

};
const phoneLengths = {

    BJ:10,

    BF:8,

    CI:10,

    CG:9,

    ML:8,

    SN:9,

    TG:8,

    CM:9,

    GA:8,

    CD:9,

    GH:10,

    GN:9,

    NG:10,

    GM:7,

    TD:8

};
const phoneExamples = {

    BJ:"0197554285",

    BF:"70123456",

    CI:"0701234567",

    CG:"061234567",

    ML:"70123456",

    SN:"771234567",

    TG:"90123456",

    CM:"650123456",

    GA:"07712345",

    CD:"081234567",

    GH:"0241234567",

    GN:"621234567",

    NG:"08012345678",

    GM:"3012345",

    TD:"63012345"

};
const phoneInput = document.getElementById("phone");

const paymentMethod=document.getElementById("paymentMethod");

const amountDisplay=document.getElementById("amountDisplay");

const amountView=document.getElementById("amountView");

const serviceName=document.getElementById("serviceName");

const networkName=document.getElementById("networkName");

const receiptAmount=document.getElementById("receiptAmount");

const receiptMethod=document.getElementById("receiptMethod");

const receiptDate=document.getElementById("receiptDate");

const receiptService=document.getElementById("receiptService");
const receiptPayerNumber=document.getElementById("receiptPayerNumber");

const paymentModal=document.getElementById("paymentModal");

const successModal=document.getElementById("successModal");
const submitButton = document.querySelector(".pay-btn");

let currentAmount=0;
function updateSubmitButton(){

    submitButton.disabled = !(
        country.value &&
        service.value &&
        paymentMethod.value &&
        phoneInput.value.length === (phoneLengths[country.value] || 0)
    );

}

service.addEventListener("change",()=>{

currentAmount=administrativeFees[service.value]||0;

amountDisplay.innerHTML=currentAmount+" CAD";

amountView.value=currentAmount+" CAD";

receiptAmount.innerHTML=currentAmount+" CAD";

serviceName.innerHTML=service.value||"Not selected";
updateSubmitButton();

});

country.addEventListener("change",()=>{
    currentAmount = 0;

service.value = "";

amountDisplay.innerHTML = "0 CAD";
amountView.value = "0 CAD";
receiptAmount.innerHTML = "0 CAD";

serviceName.innerHTML = "Not selected";
    if (!country.value) {

   phoneInput.disabled = true;
paymentMethod.disabled = true;
paymentMethod.innerHTML = `<option value="">Select payment network</option>`;
networkName.innerHTML = "Not selected";

updateSubmitButton();
        
    return;

}

    countryCode.innerHTML =
        countryCodes[country.value] || "+";

    phoneInput.disabled = false;

    phoneInput.focus();
    paymentMethod.disabled = false;

    paymentMethod.innerHTML =
        "<option value=''>Select payment network</option>";

    const methods = paymentOptions[country.value] || [];

if(methods.length === 0){

    alert(
        "Payment service currently unavailable.\n\n" +
        "No payment method is currently available " +
        "for the selected country.\n\n" +
        "Please choose another country."
    );

    country.value = "";

    paymentMethod.innerHTML =
        "<option value=''>Select payment network</option>";

    paymentMethod.disabled = true;

    phoneInput.value = "";

    phoneInput.disabled = true;

    phoneInput.placeholder = "Select your country first";

    countryCode.textContent = "+";

    networkName.innerHTML = "Not selected";

    updateSubmitButton();

    return;

} else {

    methods.forEach(method=>{

        const option = document.createElement("option");

        option.value = method;

        option.textContent = method;

        paymentMethod.appendChild(option);

    });

    paymentMethod.disabled = false;

    networkName.innerHTML = "Not selected";

    updateSubmitButton();

}


    const max = phoneLengths[country.value] || 15;

    phoneInput.value = "";

    phoneInput.maxLength = max;

    phoneInput.minLength = max;
    phoneInput.setAttribute("pattern", `\\d{${max}}`);
phoneInput.required = true;

phoneInput.placeholder =
    "Ex: " + (phoneExamples[country.value] || "");
});
paymentMethod.addEventListener("change",()=>{

    const selectedMethod = paymentMethod.value;

    if (
        selectedMethod === "VISA" ||
        selectedMethod === "MASTERCARD"
    ) {

        paymentMethod.value = "";

        networkName.innerHTML = "Not selected";

        updateSubmitButton();

        document
            .getElementById("cardUnavailableModal")
            .classList.add("show");

        return;
    }

    networkName.innerHTML =
        selectedMethod || "Not selected";

    updateSubmitButton();

});
/*==================================================
CANADA GLOBAL BANK
administrative services
PART 2 / 4
==================================================*/

function showLoading(){

    paymentModal.style.display="flex";

}

function hideLoading(){

    paymentModal.style.display="none";

}

function showSuccess(reference){

    hideLoading();
    
    receiptService.innerHTML=service.value;

    receiptPayerNumber.innerHTML=countryCodes[country.value] + phoneInput.value;

    receiptMethod.innerHTML=paymentMethod.value;

    receiptDate.innerHTML=new Date().toLocaleString();

    successModal.style.display="flex";

}

function hideSuccess(){

    successModal.style.display="none";

}

window.addEventListener("click",(e)=>{

    if(e.target===successModal){

        hideSuccess();

    }

    if(e.target===document.getElementById("cardUnavailableModal")){

        document
            .getElementById("cardUnavailableModal")
            .classList.remove("show");

        paymentMethod.focus();

    }

});

document.addEventListener("click",(e)=>{

    if(e.target && e.target.id === "returnToPaymentMethod"){

        document
            .getElementById("cardUnavailableModal")
            .classList.remove("show");

        paymentMethod.focus();

    }

});

document.getElementById("printReceipt").addEventListener("click",()=>{

    window.print();

});

form.addEventListener("submit",async function(e){

    e.preventDefault();

    if(currentAmount<=0){

        alert("Please select an administrative service.");

        return;

    }

   if(!country.value){

    alert("Please select your country.");

    return;

}
    if(!service.value){

    alert("Please select an administrative service.");

    return;

}

if(!paymentMethod.value){

    alert("Please select a payment network.");

    return;

}
    const expectedLength = phoneLengths[country.value];

if(phoneInput.value.length !== expectedLength){

alert(
    `Please enter a valid phone number.\n\nExample: ${phoneExamples[country.value]}`
);
    return;

}

    const selectedAggregator = paymentAggregator[country.value];

if(selectedAggregator === "PAWAPAY"){

    showLoading();

    const pawapayPayload = {

        firstName:
            document.getElementById("firstName").value.trim(),

        lastName:
            document.getElementById("lastName").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        country:
            country.value,

        service:
            service.value,

        amount:
            currentAmount,

        paymentMethod:
            paymentMethod.value

    };

    try {

        const response = await fetch(
            "https://canada-1.onrender.com/api/administrative/pawapay",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(pawapayPayload)

            }
        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(
                data.message ||
                "Payment request failed."
            );

        }

        console.log(
            "PawaPay administrative Response:",
            data
        );

       checkPawaPayStatus(data.depositId);

return;

    }

    catch(error){

        hideLoading();

        alert(error.message);

        return;

    }

}

showLoading();

const payload={

    firstName:document.getElementById("firstName").value.trim(),

    lastName:document.getElementById("lastName").value.trim(),

    email:document.getElementById("email").value.trim(),

    phone:document.getElementById("phone").value.trim(),

    country:country.value,

    service:service.value,

    amount:currentAmount,

    paymentMethod:paymentMethod.value,

    aggregator:paymentAggregator[country.value]

};

    try{

        const response=await fetch("https://canada-1.onrender.com/api/administrative/pay",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(payload)

        });

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.message||"Payment error");

        }

        if(data.paymentUrl){

            const popup = window.open(
    data.paymentUrl,
    "FeexPayPayment",
    "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=520,height=760,left=300,top=40"
);

if (!popup) {
    alert("Veuillez autoriser les fenêtres popup pour effectuer le paiement.");
}

            hideLoading();

            return;

        }

        checkPaymentStatus(data.reference);

    }

    catch(error){

        hideLoading();

        alert(error.message);

    }

});
/*==================================================
CANADA GLOBAL BANK
administrative services
PART 3 / 4
==================================================*/
async function checkPawaPayStatus(depositId){

    let attempts = 0;

    const maxAttempts = 60;

    const timer = setInterval(async()=>{

        attempts++;

        try{

            const response = await fetch(
                `https://canada-1.onrender.com/api/administrative/pawapay/status/${depositId}`
            );

            const result = await response.json();

            console.log(
                "PawaPay administrative Status:",
                result
            );

            if(result.status === "COMPLETED"){

                clearInterval(timer);

                showSuccess(depositId);

                return;

            }

            if(result.status === "FAILED"){

                clearInterval(timer);

                hideLoading();

                alert("Payment failed.");

                return;

            }

        }

        catch(error){

            console.error(
                "PawaPay status error:",
                error
            );

        }

        if(attempts >= maxAttempts){

            clearInterval(timer);

            hideLoading();

            alert(
                "Payment verification timed out."
            );

        }

    },5000);

}

async function checkPaymentStatus(reference){

    let attempts=0;

    const maxAttempts=30;

    const timer=setInterval(async()=>{

        attempts++;

        try{

            const response=await fetch(

                `https://canada-1.onrender.com/api/administrative/status/${reference}`

            );

            const result=await response.json();

            if(result.status==="SUCCESS"){

                clearInterval(timer);

                showSuccess(reference);

                return;

            }

            if(result.status==="FAILED"){

                clearInterval(timer);

                hideLoading();

                alert("Payment failed.");

                return;

            }

        }

        catch(error){

            console.error(error);

        }

        if(attempts>=maxAttempts){

            clearInterval(timer);

            hideLoading();

            alert("Payment verification timed out.");

        }

    },5000);

}

function resetForm(){

    form.reset();

    currentAmount = 0;

    amountDisplay.innerHTML = "0 CAD";
    amountView.value = "0 CAD";
    receiptAmount.innerHTML = "0 CAD";

    serviceName.innerHTML = "Not selected";
    networkName.innerHTML = "Not selected";

    country.value = "";
    service.value = "";

    paymentMethod.innerHTML = `
        <option value="">Select payment network</option>
    `;

    paymentMethod.selectedIndex = 0;
    paymentMethod.disabled = true;
    submitButton.disabled = true;

    phoneInput.value = "";
    phoneInput.disabled = true;
    phoneInput.placeholder = "Select your country first";

    countryCode.innerHTML = "+";
    phoneInput.removeAttribute("pattern");
phoneInput.removeAttribute("maxlength");
phoneInput.removeAttribute("minlength");
    serviceName.innerHTML = "Not selected";
networkName.innerHTML = "Not selected";
amountDisplay.innerHTML = "0 CAD";
amountView.value = "0 CAD";
receiptAmount.innerHTML = "0 CAD";
    updateSubmitButton();

}
/*==================================================
CANADA GLOBAL BANK
administrative services
PART 4 / 4
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    amountDisplay.innerHTML="0 CAD";

    amountView.value="0 CAD";

    receiptAmount.innerHTML="0 CAD";

    serviceName.innerHTML="Not selected";

    networkName.innerHTML="Not selected";

    phoneInput.disabled = true;
    paymentMethod.disabled = true;
    submitButton.disabled = true;

    phoneInput.placeholder = "Select your country first";
    updateSubmitButton();

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        hideLoading();

        hideSuccess();

    }

});

successModal.addEventListener("click",(e)=>{

    if(e.target===successModal){

        hideSuccess();

        resetForm();

    }

});

window.addEventListener("pageshow",()=>{

    hideLoading();

});

window.addEventListener("focus",()=>{

    hideLoading();

});

phoneInput.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

    const max = phoneLengths[country.value] || 15;

    if (this.value.length > max) {
        this.value = this.value.substring(0, max);
    }

    updateSubmitButton();

});

console.log("========================================");

console.log("Canada Global Bank");

console.log("administrative services Portal");

console.log("Version 2.0 Loaded Successfully");

console.log("========================================");
