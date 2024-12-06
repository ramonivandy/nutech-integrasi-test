const db = require('../helper/database/index');

const postRegistration = async (req, res) => {
    res.json({
        success: true,
        message: "Registration successfully!"
    });
}

module.exports = {
    postRegistration
}