const jwt = require('jwt-simple')
const moment = require('moment')

const SECRET_KEY = 'KJNKYHc676kjbn97kjbn9bkJNB987bIB8g79'

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(400).send({message: 'La peticion no tiene cabecera de autenticación'})
    }

    const token = req.headers.authorization.replace(/['"]+/g, "")

    try {
        var payload = jwt.decode(token, SECRET_KEY)

        if(payload.exp <= moment.unix()){
            return res.status(400).send({message: 'El token ha expirado'})
        }
    } catch (err) {
        return res.status(400).send({message: 'El token es invalido'})
    }

    req.user = payload
    next()

    //return res.status(400).send({message: 'La peticion no tiene cabecera de autenticación'})
}