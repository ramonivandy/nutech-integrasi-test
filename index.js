const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    return res.json({
        message: "This server is running properly"
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});