const axios = require('axios');
const auth_req_url = "https://accept.paymob.com/api/auth/tokens"
const payment_orders = "https://accept.paymob.com/api/ecommerce/orders";
const payment_key = "https://accept.paymob.com/api/acceptance/payment_keys"
const iframe_linke = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOP_IFRAME}?payment_token=`

const getAuthData = async (price) => {
    try {
        const response = await axios.post(auth_req_url, { api_key: process.env.PAYMOP_API_KEY })
        const token = response.data.token;
        const paymentVerification = await axios.post(payment_orders, {
            auth_token: token,
            delivery_needed: "true",
            amount_cents: price * 100,
            currency: "EGP",
        })
        const paymentId = paymentVerification.data.id;
        return { token, paymentId }
    } catch (error) {
        return { error }
    }
}

const getPaymentKey = async(order,token,paymentId) => {
        try {
        const data = {
            "auth_token": token,
           "amount_cents": order.price * 100,
            "expiration": 3600,
            "order_id": paymentId,
            "billing_data": {
                "apartment": "803",
                "email": order.receivedEmail,
                "floor": "42",
                "first_name": order.receivedName,
                "street": "Ethan Land",
                "building": "8028",
                "phone_number": order.receivedPhone,
                "shipping_method": "PKG",
                "postal_code": order.receivedPostalCode,
                "city": order.receivedAddress,
                "country": "CR",
                "last_name": "Nicolas",
                "state": "Utah"
            },
            "currency": "EGP",
            "integration_id": process.env.PAYMOP_INTEGRATION_ID
        }
        const response = await axios.post(payment_key, data)
        return { "Link": iframe_linke + response.data.token }
    } catch (error) {
        return {error}
    }
}

module.exports = { getAuthData, getPaymentKey }