const jwt = require('jwt-simple')
const moment = require('moment')

const SECRET_KEY = 'KJNKYHc676kjbn97kjbn9bkJNB987bIB8g79'

module.exports = {
    createAccessToken(user){
        const payload ={
            id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            createToken: moment().unix(),
            exp: moment().add( 3 , "hours" ).unix()
        }

        return jwt.encode( payload, SECRET_KEY )
    },
    createRefreshToken(user){
        const payload = {
            id: user._id,
            exp: moment().add( 30 , 'days' ).unix()
        }

        return jwt.encode( payload , SECRET_KEY )
    },
    decodeToken(token){
        return jwt.decode( token , SECRET_KEY , true )
    }
}