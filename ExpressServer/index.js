const mongoose = require('mongoose');
const { listen } = require('./app');
const app = require('./app')
const { DB_SERVER, PORT_SERVER, PORT_DB, DATABASE } = require('./config')

mongoose.connect(`mongodb://${DB_SERVER}:${PORT_DB}/${DATABASE}`,
    {useNewUrlParser: true, useUnifiedTopology: true}, (err, res)=>{
        if(err) throw err;
        else{
            console.log(`[ -- Database "${DATABASE}" connected -- ]`);
            app.listen(PORT_SERVER, () =>{
                console.log(`http://${DB_SERVER}:${PORT_SERVER}/`);
            })
        } 
    })