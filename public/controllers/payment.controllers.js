const mercadopago = require('mercadopago');

const createOrder = async (req, res) => {
    mercadopago.configure({
        access_token: "APP_USR-823704653713059-060910-7bea69fb541e6205f2d60a4e528f5bca-2488868666",
    });
    const result = await mercadopago.preferences.create({
        items: [
            {
                title: "Mi producto",
                unit_price: 1,
                currency_id: "ARS",
                quantity: 1,
            },
        ],
        back_urls: {
            success: "http://localhost:3000/success",
            failure: "http://localhost:3000/failure",
            pending: "http://localhost:3000/pending",
        },
        notification_url: "https://df8c-138-117-18-218.ngrok-free.app/webhook",
    });
    console.log(result);
    res.send(result.body);
};

const receiveWebhook = async (req, res) => {
    try {
        const payment = req.query;
        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment['id']);
            console.log(data);
        }
        res.sendStatus(204);
    } catch (error) {
        console.error("Error receiving webhook:", error);
        return res.status(500).json({
            message: "Error receiving webhook",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    receiveWebhook
};