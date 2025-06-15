const { MercadoPagoConfig, Preference } = require('mercadopago');

const beAProUser = async ( req, res ) => {
    const client = new MercadoPagoConfig({ accessToken: process.env.KEY});

    const preference = new Preference(client);
    
    const body = {
        items: [
            {
            id: Math.random(),
            title: 'Assinatura profissional Pro',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 45,
            },
        ]
    };


    await preference.create({body}).then((response)=>console.log(response));
}

const beAPremiumUser = async ( req, res ) => {
    const client = new MercadoPagoConfig({ accessToken: process.env.KEY});

    const preference = new Preference(client);
    
    const body = {
        items: [
            {
            id: Math.random(),
            title: 'Assinatura profissional Premium',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 70,
            },
        ]
    };


    await preference.create({body}).then((response)=>console.log(response));
}

module.exports = { beAProUser, beAPremiumUser };