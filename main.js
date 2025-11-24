"use strict";

import express from "express";
import layouts from "express-ejs-layouts";
import mongoose from "mongoose";
import methodOverride from "method-override";
import passport from "passport";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import connectFlash from "connect-flash";
import dotenv from "dotenv";
import { User } from "./models/user.js";
import { homeController } from "./controllers/homeController.js";
import { errorController } from "./controllers/errorController.js";
import { subscribersController } from "./controllers/subscribersController.js";
import { usersController } from "./controllers/usersController.js";
import { coursesController } from "./controllers/coursesController.js";

dotenv.config();
const app = express();
const router = express.Router();

if (!process.env.MONGODB_URI) {
    console.error("Missing required environment variable MONGODB_URI.");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch(error => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

app.set("port", process.env.PORT || 3001);
app.set("view engine", "ejs");

//Passport configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use(cookieParser(process.env.SESSION_SECRET));
router.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        cookie: { max: 4000000 },
        resave: false,
        saveUninitialized: false
    })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
);

router.use(layouts);
router.use(express.static("public"));

router.use(
    express.urlencoded({
        extended: false
    })
);
router.use(express.json());

router.get("/", homeController.index);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post(
    "/subscribers/create",
    subscribersController.create,
    subscribersController.redirectView
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
    "/subscribers/:id/update",
    subscribersController.update,
    subscribersController.redirectView
);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.delete(
    "/subscribers/:id/delete",
    subscribersController.delete,
    subscribersController.redirectView
);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});
