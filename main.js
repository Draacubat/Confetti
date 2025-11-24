import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import methodOverride from "method-override";
import expressEjsLayouts from "express-ejs-layouts";
import { errorController } from "./controllers/errorController.js";
import { homeController } from "./controllers/homeController.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI
mongoose.connect(mongoUri);

const app = express();
const router =express.Router()

router.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
);

app.set("view engine", "ejs");
router.use(expressEjsLayouts);
router.set("port", process.env.PORT || 3001);

router.use(
    express.urlencoded({
        extended: false
    })
);
router.use(express.json());
router.use(express.static("public"));

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/courses", homeController.showCourses);
router.get("/contact", homeController.showSignUp);
router.post("contact", homeController.postedSignUpForm);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

router.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});