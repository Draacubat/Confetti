import mongoose from "mongoose";

const subscriberSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    zipCode: { type: Number, required: true },
    streetAddress: { type: String, required: true },
    vip: Boolean,
});

export default mongoose.model("Subscriber", subscriberSchema);