const { Router } = require('express');
const { receiveWebhook, createOrder } = require('../controllers/payment.controllers.js');

const router = Router();
router.post('/create-order', createOrder);
router.get('/success', (req, res) => res.send('Verify Payment Endpoint'));
router.get('/failure', (req, res) => res.send('Payment Failed Endpoint'));
router.get('/pending', (req, res) => res.send('Payment Pending Endpoint'));

router.post('/webhook', receiveWebhook);

module.exports = router;