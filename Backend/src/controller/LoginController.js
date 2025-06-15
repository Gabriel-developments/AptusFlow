const GymMember = require("../model/GymMember");
const Personal = require("../model/Personal");
const bcrypt = require('bcryptjs');

const Login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const gymMember = await GymMember.findOne({ email }).select('+password');
        const personal = await Personal.findOne({ email }).select('+password');

        if (!gymMember && !personal) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        if(personal) {
            const isMatch = await personal.comparePassword(password);
        }
        
        const isMatch = await gymMember.comparePassword(password);

        
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha inválida' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

module.exports = Login;