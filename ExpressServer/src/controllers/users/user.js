const bcrypt = require('bcrypt-nodejs')
const jwt = require('../../services/jwt')
const User = require('../../models/users/user');
const fs = require('fs')
const path = require('path');
const { exists } = require('../../models/users/user');
const user = require('../../models/users/user');

module.exports = {
    signUp( req , res){
        const user = new User();

        const { email, password, repeatPassword, name, lastname } = req.body

        user.name = name
        user.lastname = lastname
        user.email = email.toLowerCase()
        

        if(!password || !repeatPassword)
            res.status(404).send({message: "Password required"})
        else
            if(password !== repeatPassword)
                res.status(404).send({message: "Passwords dismatch"})
            else{
                bcrypt.hash(password, null, null, function(err, hash){
                    if(err){
                        res.status(404).send({message: "Password encrypt error"})
                    }else{
                        user.password = hash
                        user.save((err, userStored) => {
                            if(err){
                                res.status(404).send({message: err.message})
                            }else{
                                res.status(200).send({"user": userStored})
                            }
                        })
                    }
                })
            }
    },
    signIn( req , res){
        const email = req.body.email.toLowerCase()
        const password = req.body.password

        User.findOne({email}, (err, userStored) => {
            if(err){
                res.status(400).send({message: "Sign In error"})
            }else{
                if(!userStored){
                    res.status(400).send({message: "User not found"})
                }else{
                    bcrypt.compare( password , userStored.password , (err, check) =>{
                        if(err){
                            res.status(400).send({message: "Sign In error"})
                        }else if(!check){
                            res.status(400).send({message: "Invalid password"})
                        }else{
                            if(!userStored.active){
                                res.status(400).send({message: "Inactive User"})
                            }else{
                                res.status(200).send({
                                    accessToken: jwt.createAccessToken(userStored),
                                    refreshToken: jwt.createRefreshToken(userStored)
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    uploadAvatar(req, res){
        const params = req.params

        user.findById({_id:params.id}, (err, userData) =>{
            if(err){
                res.status(400).send({message: "Server error"})
            }else{
                if(!userData){
                    res.status(400).send({message: "User not found"})
                }else{
                    let user = userData

                    if(req.files){
                        let filePath = req.files.avatar.path
                        let fileSplit = filePath.split("\\")
                        let fileName = fileSplit[2]
                        let extSplit = fileName.split(".")
                        let fileExt = extSplit[1]

                        if(fileExt !== "png" && fileExt !== "jpg"){
                            res.status(400).send({message: "Invalid format"})
                        }else{
                            user.avatar = fileName;
                            User.findByIdAndUpdate({_id: params.id}, user, (err, userResult) =>{
                                if(err){
                                    res.status(400).send({message: "Server error"})
                                }else{
                                    if(!userResult){
                                        res.status(400).send({message: "User update error"})
                                    }else{
                                        res.status(200).send({avatarName: fileName})
                                    }
                                }
                            })
                        }
                    }
                }
            }
        })
    },
    getAvatar(req, res){
        const avatarName = req.params.avatarName
        const filePath = `./uploads/avatar/${avatarName}`

        fs.access(filePath, error =>{
            if(error){
                res.status(400).send({message: "Avatar not found"})
            }else{
                res.sendFile(path.resolve(filePath))
            }
        })
    },
    async updateUser(req, res){
        let userData = req.body
        userData.email = req.body.email.toLowerCase()
        const params = req.params

        if(userData.password){
            await bcrypt.hash(userData.password, null, null, (err, hash) => {
                if(err){
                    res.status(400).send({message: "Server error"})
                }else{
                    userData.password = hash
                }
            })
        }

        User.findByIdAndUpdate({_id:params.id}, userData, (err, userUpdate) => {
            if(err){
                res.status(400).send({message: "Server error"})
            }else{
                if(!userUpdate){
                    res.status(400).send({message: "User not found"})
                }else{
                    res.status(200).send({message: "Updated user"})
                }
            }
        })
    },
    async activateUser(req, res){
        const { id } = req.params
        const { active } = req.body

        User.findByIdAndUpdate(id, { active }, (err, userStored) => {
            if(err){
                res.status(400).send({message: "Server error"})
            }else{
                if(!userStored){
                    res.status(400).send({message: "User not found"})
                }else{
                    if(active === true){
                        res.status(200).send({message: "Actived user"})
                    }else{
                        res.status(200).send({message: "Inactived user"})
                    }
                }
            }
        })
    },
    deleteUser(req, res){
        const { id } = req.params

        User.findOneAndRemove(id, (err, userDeleted) => {
            if(err){
                res.status(400).send({message: "Server error"})
            }else{
                if(!userDeleted){
                    res.status(400).send({message: "User not found"})
                }else{
                    res.status(200).send({message: "Deleted user"})
                }
            }
        })
    }
}