const express = require('express');
const { configDatabase } = require('./config/configDatabase');
const { configExpress } = require('./config/configExpress');
const { configHbs } = require('./config/configHbs');
const { configRoutes } = require('./config/configRoutes');
const { register, login } = require('./services/user');
const { createToken, verifyToken } = require('./services/jwt');

start();

async function start(){

    const app = express();

    await configDatabase();
    configExpress(app);
    configHbs(app);
    configRoutes(app);

    app.listen(3000, () => {
        console.log(' Server started http://localhost:3000');
        //test()
    });
}


async function test(){
    try{
        const result = await login('john@abv.bg', '123456');
        console.log(result);

        const token = createToken(result);

        console.log(token);
        const parsedData = verifyToken(token);
        console.log(parsedData)
    } catch (err){
        console.log('Caught error ')
        console.log(err.message)
    }
}
