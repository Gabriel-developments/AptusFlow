const mongoose = require('mongoose');

const connectInDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/AptusFlow');
        console.log('Conectado ao MongoDB');
    } catch (err) {
        console.error('Erro na conexão com MongoDB:', err.message);
        process.exit(1); 
    }
}

module.exports = connectInDB