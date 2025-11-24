"use strict";

import { Course } from "../models/course.js";

const getCourseParams = (body) => {
    return {
        title: body.title,
        description: body.description,
        maxStudents: body.maxStudents,
        cost: body.cost,
    };
};

const index = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.locals.courses = courses;
        next();
    } catch (error) {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
    }
};

const indexView = (req, res) => {
    res.render("courses/index");
};

const newCourse = (req, res) => {
    res.render("courses/new");
};

const create = async (req, res, next) => {
    try {
        let courseParams = getCourseParams(req.body);
        const course = await Course.create(courseParams);
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
    } catch (error) {
        console.log(`Error saving course: ${error.message}`);
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
        let courseId = req.params.id;
        const course = await Course.findById(courseId);
        res.locals.course = course;
        next();
    } catch (error) {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
    }
};

const showView = (req, res) => {
    res.render("courses/show");
};

const edit = async (req, res, next) => {
    try {
        let courseId = req.params.id;
        const course = await Course.findById(courseId);
        res.render("courses/edit", {
            course: course,
        });
    } catch (error) {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        let courseId = req.params.id,
            courseParams = getCourseParams(req.body);

        const course = await Course.findByIdAndUpdate(courseId, {
            $set: courseParams,
        });
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
    } catch (error) {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        let courseId = req.params.id;
        await Course.findByIdAndRemove(courseId);
        res.locals.redirect = "/courses";
        next();
    } catch (error) {
        console.log(`Error deleting course by ID: ${error.message}`);
        next(error);
    }
};

export const coursesController = {
    index,
    indexView,
    new: newCourse,
    create,
    redirectView,
    show,
    showView,
    edit,
    update,
    delete: deleteCourse
};