import express from "express";
import {parseGet} from "../middlewares/parse_get";
import {parsePost} from "../middlewares/parse_post";
import {parseDelete} from "../middlewares/parse_delete";
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
        customStore['set']("recipes", req.body.data);
        res.send({posted: customStore.get("recipes")});
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send({err: 'Invalid or expired jwt token.'})
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
        customStore['set']("recipes", req.body.data);
        res.send({posted: customStore.get("recipes")});
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send({err: 'Invalid or expired jwt token.'})
    }
});
