const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const currentTime = new Date().toLocaleString();
        const responseJson = { ServerTime: currentTime + ' +7' };

        res.json(responseJson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
