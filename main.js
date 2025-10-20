import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3001);
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});