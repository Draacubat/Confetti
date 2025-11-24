"use strict";

import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Subscriber } from "../models/subscriber.js";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            first: {
                type: String,
                trim: true
            },
            last: {
                type: String,
                trim: true
            }
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        zipCode: {
            type: Number,
            min: [1000, "Zip code too short"],
            max: 99999
        },
        password: {
            type: String,
            required: true
        },
        subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
        courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
    },
    {
        timestamps: true
    }
);

userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", async function (next) {
    try {
        let user = this;
        if (user.subscribedAccount === undefined) {
            const subscriber = await Subscriber.findOne({ email: user.email });
            user.subscribedAccount = subscriber;
        }
        next();
    } catch (error) {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
    }
});

export const User = mongoose.model("User", userSchema);