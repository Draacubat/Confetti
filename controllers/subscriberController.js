import subscriber from "../models/subscriber.js";
import Subscriber from "../models/subscriber.js"

const getSubscriberParams = (body) => ({
    name: body.name,
    email: body.email,
    zipCode: body, zipCode
});

const index = ((req, res, next) => {
    Subscriber.find()
        .then((subscribers) => {
            res.locals.subscribers = subscribers
            next();
        });
        .catch((error) => {
        console.log(`Error fetching subscribers: ${error.message}`);
        });
});

//Function to create a new subscriber
const