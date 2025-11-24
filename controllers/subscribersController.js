"use strict";

import { Subscriber } from "../models/subscriber.js";

const getSubscriberParams = (body) => {
    return {
        name: body.name,
        email: body.email,
        zipCode: parseInt(body.zipCode),
    };
};

const index = async (req, res, next) => {
    try {
        const subscribers = await Subscriber.find();
        res.locals.subscribers = subscribers;
        next();
    } catch (error) {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
    }
};

const indexView = (req, res) => {
    res.render("subscribers/index");
};

const newSubscriber = (req, res) => {
    res.render("subscribers/new");
};

const create = async (req, res, next) => {
    try {
        let subscriberParams = getSubscriberParams(req.body);
        const subscriber = await Subscriber.create(subscriberParams);
        res.locals.redirect = "/subscribers";
        res.locals.subscriber = subscriber;
        next();
    } catch (error) {
        console.log(`Error saving subscriber: ${error.message}`);
        next(error);
    }
};

const redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
};

const show = async (req, res, next) => {
    try {
        let subscriberId = req.params.id;
        const subscriber = await Subscriber.findById(subscriberId);
        res.locals.subscriber = subscriber;
        next();
    } catch (error) {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
    }
};

const showView = (req, res) => {
    res.render("subscribers/show");
};

const edit = async (req, res, next) => {
    try {
        let subscriberId = req.params.id;
        const subscriber = await Subscriber.findById(subscriberId);
        res.render("subscribers/edit", {
            subscriber: subscriber,
        });
    } catch (error) {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        let subscriberId = req.params.id,
            subscriberParams = getSubscriberParams(req.body);

        const subscriber = await Subscriber.findByIdAndUpdate(subscriberId, {
            $set: subscriberParams,
        });
        res.locals.redirect = `/subscribers/${subscriberId}`;
        res.locals.subscriber = subscriber;
        next();
    } catch (error) {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
    }
};

const deleteSubscriber = async (req, res, next) => {
    try {
        let subscriberId = req.params.id;
        await Subscriber.findByIdAndRemove(subscriberId);
        res.locals.redirect = "/subscribers";
        next();
    } catch (error) {
        console.log(`Error deleting subscriber by ID: ${error.message}`);
        next(error);
    }
};

export const subscribersController = {
    index,
    indexView,
    new: newSubscriber,
    create,
    redirectView,
    show,
    showView,
    edit,
    update,
    delete: deleteSubscriber
};