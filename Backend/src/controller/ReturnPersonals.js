const Personal = require('../model/Personal');

const ReturnPersonals = async (req, res) => {
    const Personals = await Personal.find().select('-password');

    return res.json(Personals);


}

module.exports = ReturnPersonals;