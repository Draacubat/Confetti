"use strict";

import { User } from "../models/user.js";

const getUserParams = (body) => {
    return {
        name: {
            first: body.first,
            last: body.last,
        },
        email: body.email,
        password: body.password,
        zipCode: body.zipCode,
    };
};

export const usersController = {
    index: async (req, res, next) => {
        try {
            const users = await User.find();
            res.locals.users = users;
            next();
        } catch (error) {
            console.log(`Error fetching users: ${error.message}`);
            next(error);
        }
    },

    indexView: (req, res) => {
        res.render("users/index");
    },

    login: (req, res) => {
        res.render('users/login');
    },

    new: (req, res) => {
        res.render("users/new");
    },

    create: async (req, res, next) => {
        try {
            let userParams = getUserParams(req.body);
            const user = await User.create(userParams);
            res.locals.redirect = "/users";
            res.locals.user = user;
            next();
        } catch (error) {
            console.log(`Error saving user: ${error.message}`);
            next(error);
        }
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },

    show: async (req, res, next) => {
        try {
            let userId = req.params.id;
            const user = await User.findById(userId);
            res.locals.user = user;
            next();
        } catch (error) {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        }
    },

    showView: (req, res) => {
        res.render("users/show");
    },

    edit: async (req, res, next) => {
        try {
            let userId = req.params.id;
            const user = await User.findById(userId);
            res.render("users/edit", {
                user: user,
            });
        } catch (error) {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            let userId = req.params.id,
                userParams = getUserParams(req.body);

            const user = await User.findByIdAndUpdate(userId, {
                $set: userParams,
            });
            res.locals.redirect = `/users/${userId}`;
            res.locals.user = user;
            next();
        } catch (error) {
            console.log(`Error updating user by ID: ${error.message}`);
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            let userId = req.params.id;
            await User.findByIdAndRemove(userId);
            res.locals.redirect = "/users";
            next();
        } catch (error) {
            console.log(`Error deleting user by ID: ${error.message}`);
            next(error);
        }
    },
};