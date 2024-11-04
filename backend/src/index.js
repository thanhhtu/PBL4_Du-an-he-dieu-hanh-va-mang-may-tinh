import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routers from './apis';
import errorHandler from './middleware/handleError.middleware.js';
import validateMiddleware from './middleware/validate.middleware.js';

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.use('/', routers);

app.use(errorHandler);
app.use(validateMiddleware.checkUrl);

const port = process.env.PORT || 4000;
app.listen(port, (err) => {
    if(!err){
        console.log(`Example app listening on port ${port}`);
    }else{
        console.log('Error: ' + err.message);
    }
})
