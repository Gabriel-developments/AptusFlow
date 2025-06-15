const GymMember = require("../model/GymMember");
const Personal = require("../model/Personal");
const bcrypt = require('bcryptjs');

const RegisterForGymMember = async (req, res) => {
    const {name, email, password, objective, hasLimitingConditions,         limitingConditions} = req.body;

    try {
        const existingUser = await GymMember.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Já existe um usuário com este email.' });
        }

        const newGymMember = new GymMember({
            name,
            email,
            password,
            objective,
            hasLimitingConditions,         
            limitingConditions
        });

        await newGymMember.save();

        const gymMemberObj = new GymMember.toObject();
        delete gymMemberObj.password;

        return res.status(201).json({ message: 'Usuário executor criado com sucesso!', user: gymMemberObj });
    } catch (err) {
        console.error('Erro ao criar usuário executor:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Erro interno do servidor ao criar usuário executor.' });
    }

};

const RegisterForPersonal = async (req, res) => {
    const {name, email, password, CREF} = req.body;

    try {
        const existingUser = await Personal.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Já existe um usuário com este email.' });
        }

        const newPersonal = new Personal({
            name,
            email,
            password,
            CREF
        });

        await newPersonal.save();

        const personalObj = new Personal.toObject();
        delete personalObj.password;

        return res.status(201).json({ message: 'Usuário executor criado com sucesso!', user: personalObj });
    } catch (err) {
        console.error('Erro ao criar usuário executor:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Erro interno do servidor ao criar usuário executor.' });
    }
    
}


module.exports = {
    RegisterForGymMember,
    RegisterForPersonal
}