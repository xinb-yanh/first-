const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    username: {
        admin
        // type: String
    },
    password: {
        admin,
        // type: String,
        // select: false,
        // set(val) {
        //     return require('bcrypt').hashSync(val, 12)
        // }
    },



})
module.exports = mongoose.model('AdminUser', schema)