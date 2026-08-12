const express = require("express");
const axios = require("axios");

const router = express.Router();

// =========================
// CONFIGURATION FEEXPAY
// =========================

const FEEXPAY_API_KEY = process.env.FEEXPAY_API_KEY;

const FEEXPAY_SHOP_ID = process.env.FEEXPAY_SHOP_ID;

const CAD_TO_XOF = Number(
    process.env.CAD_TO_XOF || 430
);

// =========================
// FEEXPAY API
// =========================

const API =
"https://api-v2.feexpay.me/api/transactions/public";

// =========================
// URLS API
// =========================

const URLS = {

    // ========= BENIN =========

    MTN: `${API}/requesttopay/mtn`,

    MOOV: `${API}/requesttopay/moov`,

    CELTIIS: `${API}/requesttopay/celtiis_bj`,

    CORIS: `${API}/requesttopay/coris`,

    // ========= BURKINA FASO =========

    ORANGE_BF: `${API}/requesttopay/orange_bf`,

    MOOV_BF: `${API}/requesttopay/moov_bf`,

WAVE_BF: `${API}/requesttopay/wave_bf`,
// ========= COTE D'IVOIRE =========

MTN_CI: `${API}/requesttopay/mtn_ci`,

MOOV_CI: `${API}/requesttopay/moov_ci`,

ORANGE_CI: `${API}/requesttopay/orange_ci`,

WAVE_CI: `${API}/requesttopay/wave_ci`,

// ========= MALI =========

ORANGE_ML: `${API}/requesttopay/orange_ml`,

MOBICASH: `${API}/requesttopay/mobicash_ml`,

// ========= SENEGAL =========

ORANGE_SN: `${API}/requesttopay/orange_sn`,

FREE_SN: `${API}/requesttopay/free_sn`,

WAVE_SN: `${API}/requesttopay/wave_sn`,

// ========= TOGO =========

TOGOCOM: `${API}/requesttopay/togocom_tg`,

MOOV_TG: `${API}/requesttopay/moov_tg`,

// ========= CONGO =========

MTN_CG: `${API}/requesttopay/mtn_cg`
};

// =========================
// PAYMENT REQUEST
// =========================

router.post("/pay", async (req, res) => {

    try {

        const {
    firstName,
    lastName,
    email,
    phone,
    amount,
    paymentMethod,
    country
} = req.body;

      // =========================
// CONVERSION CAD -> XOF
// =========================

const amountXOF = Math.round(
    Number(amount) * CAD_TO_XOF
);

      if (!FEEXPAY_API_KEY || !FEEXPAY_SHOP_ID) {

    return res.status(500).json({
        success: false,
        message: "FeezPay configuration missing."
    });

}
const method = String(paymentMethod || "").toUpperCase();

        // =========================
// CARD PAYMENT LINKS
// =========================

const CARD_LINKS = {

    430: "https://link.feexpay.me/HmiHkiFD/Administrative-Fees",

    36550: "https://link.feexpay.me/mYv1lsUC/",

    43000: "https://link.feexpay.me/jTtaQutH/",

    64500: "https://link.feexpay.me/N3eq2gHc/",

    77400: "https://link.feexpay.me/b0KmVHLt/Work-Permit",

    107500: "https://link.feexpay.me/qY4Ma1qZ/Permanent"

};

        // =========================
// CARD PAYMENT
// =========================

if (method === "VISA" || method === "MASTERCARD") {

    const paymentUrl = CARD_LINKS[amountXOF];

    if (!paymentUrl) {

        return res.status(400).json({

            success: false,

            message: "Payment link not configured."

        });

    }

    return res.json({

        success: true,

        paymentUrl

    });

}
// =========================
// PAYMENT MAPPING
// =========================

const PAYMENT_MAP = {

    // ========= BENIN =========

    BJ: {
        MTN: "MTN",
        MOOV: "MOOV",
        CELTIIS: "CELTIIS",
        CORIS: "CORIS"
    },

    // ========= BURKINA =========

    BF: {
        ORANGE: "ORANGE_BF",
        MOOV: "MOOV_BF",
        WAVE: "WAVE_BF"
    },

    // ========= COTE D'IVOIRE =========

    CI: {
        MTN: "MTN_CI",
        ORANGE: "ORANGE_CI",
        MOOV: "MOOV_CI",
        WAVE: "WAVE_CI"
    },

    // ========= MALI =========

    ML: {
        ORANGE: "ORANGE_ML",
        MOBICASH: "MOBICASH"
    },

    // ========= SENEGAL =========

    SN: {
        ORANGE: "ORANGE_SN",
        FREE: "FREE_SN",
        WAVE: "WAVE_SN"
    },

    // ========= TOGO =========

    TG: {
        TOGOCOM: "TOGOCOM",
        MOOV: "MOOV_TG"
    },

    // ========= CONGO =========

    CG: {
        MTN: "MTN_CG"
    }

};

const endpointKey =
    PAYMENT_MAP[country]?.[method];

const endpoint = URLS[endpointKey];

if (!endpoint) {

    return res.status(400).json({
        success: false,
        message: "Unsupported payment method."
    });

}

// =========================
// DEBUG FEEXPAY REQUEST
// =========================

console.log("===== FEEXPAY REQUEST =====");

console.log({
    endpoint,
    shop: FEEXPAY_SHOP_ID,
    amountCAD: amount,
    amountXOF,
    phone,
    paymentMethod: method,
    firstName,
    lastName
});

        let phoneNumber = String(phone || "").replace(/\D/g, "");

switch (country) {

   case "BJ":
    if (!phoneNumber.startsWith("229")) {
        phoneNumber = "229" + phoneNumber;
    }
    break;

    case "TG":
        if (!phoneNumber.startsWith("228")) {
            phoneNumber = "228" + phoneNumber.replace(/^0/, "");
        }
        break;

    case "CI":
        if (!phoneNumber.startsWith("225")) {
            phoneNumber = "225" + phoneNumber.replace(/^0/, "");
        }
        break;

    case "BF":
        if (!phoneNumber.startsWith("226")) {
            phoneNumber = "226" + phoneNumber.replace(/^0/, "");
        }
        break;

    case "ML":
        if (!phoneNumber.startsWith("223")) {
            phoneNumber = "223" + phoneNumber.replace(/^0/, "");
        }
        break;

    case "SN":
        if (!phoneNumber.startsWith("221")) {
            phoneNumber = "221" + phoneNumber.replace(/^0/, "");
        }
        break;

    case "CG":
        if (!phoneNumber.startsWith("242")) {
            phoneNumber = "242" + phoneNumber.replace(/^0/, "");
        }
        break;
}
console.log("==================================");
console.log("Country :", country);
console.log("Operator :", method);
console.log("Original :", phone);
console.log("Sent :", phoneNumber);
console.log("Endpoint :", endpoint);
console.log("==================================");

const response = await axios.post(

    endpoint,

    {

        shop: FEEXPAY_SHOP_ID,

        amount: amountXOF,

        phoneNumber: phoneNumber,

        first_name: firstName,

        last_name: lastName,

        description: "Canada Immigration Payment"

    },

            {

                headers: {

                    Authorization: `Bearer ${FEEXPAY_API_KEY}`,

                    "Content-Type": "application/json"

                }

            }

        );
      // =========================
// DEBUG FEEXPAY RESPONSE
// =========================

console.log("===== FEEXPAY RESPONSE =====");

console.log(response.data);

        return res.json({

            success: true,

            reference: response.data.reference,

            status: response.data.status

        });

    }

    catch(error){

console.error("========== FEEXPAY ERROR ==========");
console.error(error.response?.status);
console.error(JSON.stringify(error.response?.data, null, 2));
console.error("===================================");
        return res.status(500).json({

            success:false,

message:
    error.response?.data?.errors?.[0]?.constraints?.[0] ||
    error.response?.data?.message ||
    error.message
        });

    }

});
// =========================
// PAYMENT STATUS
// =========================

router.get("/status/:reference", async (req, res) => {

    try {

        const response = await axios.get(

            `https://api-v2.feexpay.me/api/transactions/public/single/status/${req.params.reference}`,

            {

                headers: {

                    Authorization: `Bearer ${FEEXPAY_API_KEY}`

                }

            }

        );
        console.log(response.data);

        const transaction = response.data;

        let status = "PENDING";

        if (transaction.status === "SUCCESS") {

            status = "SUCCESS";

        }

        if (transaction.status === "FAILED") {

            status = "FAILED";

        }

        return res.json({

            success: true,

            reference: transaction.reference,

            amount: transaction.amount,

            status

        });

    }

    catch(error){

        console.error(error.response?.data || error.message);

        return res.status(500).json({

            success:false,

            message:error.response?.data || error.message

        });

    }

});
// =========================
// EXPORT
// =========================

module.exports = router;
