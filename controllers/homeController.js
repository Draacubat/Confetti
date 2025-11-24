"use strict";

const index = (req, res) => {
  res.render("index");
};

export const homeController = { index };