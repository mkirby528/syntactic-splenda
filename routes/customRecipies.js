import express from "express";
import {parseGet} from "../middlewares/parse_get";
import {parsePost} from "../middlewares/parse_post";
import {parseDelete} from "../middlewares/parse_delete";
import {parsePath} from "../middlewares/parse_utils";
import axios from "axios"
import * as jwt from "jsonwebtoken";

export const router = express.Router();
export const prefix = '/custom';

const {customStore} = require('../data/DataStore');


router.get('/*', parseGet, function (req, res) {
    
  const result = req.handleGet(customStore);
  if (typeof result !== 'undefined') {
    res.send({result})
    
  }
});

router.post('/*',(req, res,next)=>{
    if (!req.token) {
        return res.status(401).send({
            error: 'Authorization header not sent. This route requires the user to authenticate.' +
                ' If you passed a jwt token, make sure it is a \'Bearer\' token.',
            example: 'inside authorization header: Bearer jws.token.here'
        })
    }

    try {
        req.user = jwt.verify(req.token, process.env.SECRET_KEY);
        let {path} = parsePath(req);

        customStore['set'](path, req.body.data);
        res.send({posted: customStore.get(path)});
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send({err: 'Invalid or expired jwt token.'})
    }
});

//Need to rethink this. JWT is probably not the best way to keep track of who owns a resource 
router.delete('/*',async(req, res,next)=>{
    if (!req.token) {
        return res.status(401).send({
            error: 'Authorization header not sent. This route requires the user to authenticate.' +
                ' If you passed a jwt token, make sure it is a \'Bearer\' token.',
            example: 'inside authorization header: Bearer jws.token.here'
        })
    }

    try {
        req.user = jwt.verify(req.token, process.env.SECRET_KEY);
        let {path} = parsePath(req);
        try {
            if (typeof customStore.get(path) === 'undefined') {
                res.status(400).send({err: `Resource doesn't exist`, path});
                return undefined;
            }
            let username = await axios
            .get("http://localhost:3000/account/status", {
              headers: { Authorization: `Bearer ${req.token}` }
            })
            .then(res => {
              return(res.data.user.name);
            });

            let userResource = customStore.get(path).author === username;
            if(userResource){
                console.log('here')
            customStore.del(path);
            res.status(204);
        }else{
                res.status(401).send({err: 'This resource does not belong to the logged in user.'})

            }
            return {path, status: 'delete successful'};
        } catch (e) {
            console.log(e)
            res.status(500).send({err: 'Error parsing request. Check that you have formed your path correctly.', path});
            return undefined;
        }
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send({err: 'Invalid or expired jwt token.'})
    }
});
