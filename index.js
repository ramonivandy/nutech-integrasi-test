const express = require('express');
const app = express();
const config = require('./src/helper/global_config');
const port = config.get('/port') || 3001;

app.get('/', (req, res) => {
    return res.json({
        message: "This server is running properly"
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});