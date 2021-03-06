const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
            .then((favorites) => {
                if (favorites != null) {
                    for (const id of req.body) {
                        if (favorites.dishes.indexOf(id._id) === -1) {
                            favorites.dishes.push(id._id);
                        }
                    }
                    favorites.save()
                    .then((favorites) => {
                        console.log('Added dishes to Favorites Document ', favorites);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
                    .catch((err) => next(err));
                }
                else {
                    var dishIds = req.body.map(id => id._id)
                    Favorites.create({
                        user: req.user._id,
                        dishes: dishIds
                    })
                    .then((favorites) => {
                        console.log('Favorites Document Created ', favorites);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
                    .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id}).remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .then((err) => next(err))
    });


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.dishId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
        .then((favorites) => {
            if (favorites) {
                if (favorites.dishes.indexOf(req.params.dishId) === -1) {
                    favorites.dishes.push(req.params.dishId);
                    favorites.save()
                    .then((favorites) => {
                        console.log('Added dishes to Favorites Document ', favorites);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
                    .catch((err) => next(err));
                }
                else {
                    err = new Error(`Dish ${req.params.dishId} already in favorites.`)
                    err.status = 404;
                    return next(err);
                }
            }
            else {
                Favorites.create({
                    user: req.user._id,
                    dishes: [req.params.dishId]
                })
                .then((favorites) => {
                    console.log('Favorites Document Created ', favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                })
                .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
        .then((favorites) => {
            if (favorites.dishes.indexOf(req.params.dishId) === -1) {
                err = new Error(`Dish ${req.params.dishId} not in favorites.`)
                err.status = 404;
                return next(err);
            }
            else {
                favorites.dishes = favorites.dishes.filter(id => id != req.params.dishId)
                favorites.save()
                    .then((favorites) => {
                        console.log('Added dishes to Favorites Document ', favorites);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
    });


module.exports = favoriteRouter;