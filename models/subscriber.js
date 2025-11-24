"use strict";

import mongoose from "mongoose";

const { Schema } = mongoose;

const subscriberSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  {
    timestamps: true
  }
);

subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);