const RegisterForGymMember = async (req, res) => {
    const {name, email, password, objective, hasLimitingConditions,         limitingConditions} = req.body;

};

const RegisterForPersonal = async (req, res) => {
    const {name, email, password, CREF} = req.body;

    
}


module.exports = {
    RegisterForGymMember,
    RegisterForPersonal
}