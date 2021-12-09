const jwt = require('../../services/jwt')
const moment = require('moment')
const User = require('../../models/users/user')

module.exports = {
    refreshAccessToken(req, res){
        const { refreshToken } = req.body
        const isTokenExpired = willExpiredToken(refreshToken)

        if(isTokenExpired){
            res.status(400).send({message: "El token ha caducado"})
        }else{
            const { id } = jwt.decodeToken(refreshToken)
            User.findOne({_id: id}, (err, userStored) => {
                if(err){
                    res.status(400).send({message: "Error de servidor"})
                }else{
                    if(!userStored){
                        res.status(400).send({message: "El usuario no encontrado"})
                    }else{
                        res.status(200).send({
                            accessToken: jwt.createAccessToken(userStored),
                            refreshToken: refreshToken
                        })
                    }
                }
            })
        }
    }
}

function willExpiredToken(token){
    const { exp } = jwt.decodeToken(token)
    const currentDate = moment().unix()

    if(currentDate > exp){
        return true
    }else{
        return false
    }
}