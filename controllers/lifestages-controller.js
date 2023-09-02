const Lifestage = require('../models/Lifestage');
const { generateFetchPipeline, fetchSkillsPipeline } = require('../pipelines/lifestage-pipelines');

// GET

const getAllLifestages = async (req, res, next) => {
    try {
        const pipeline = generateFetchPipeline(req.query);
        const data = await Lifestage.aggregate(pipeline).collation({ locale: 'en', strength: 2 });
        if (data.length) return res.status(200).send(data);
        else return res.status(404).send('No data found');
    } catch (err) {
        res.locals.endpoint = 'getAllLifestages';
        return next(err);
    };
};

const getOneLifestage = async (req, res, next) => {
    try {
        const data = await Lifestage.findById(req.params.id)
        if (data) return res.status(200).send(data);
        else return res.status(404).send('No data found matching that ID');
    } catch (err) {
        res.locals.endpoint = 'getOneLifestage';
        return next(err);
    };
};

const getSkills = async (req, res, next) => {
    try {
        const pipeline = fetchSkillsPipeline();
        const data = await Lifestage.aggregate(pipeline);
        if (data.length) return res.status(200).send(data);
        else return res.status(404).send('No data found');
    } catch (err) {
        res.locals.endpoint = 'getSkills';
        return next(err);
    };
};

// POST

const createNewLifestage = async (req, res, next) => {
    try {
        const newLifestage = new Lifestage ({
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            title: req.body.title,
            description: req.body.description,
            soft_skills: req.body.soft_skills,
            hard_skills: req.body.hard_skills,
            achievements: req.body.achievements,
            type: req.body.type,
            background_col: req.body.background_col,
            link: req.body.link,
            images: req.body.images,
            front_image: req.body.front_image
        });
    
        const data = await newLifestage.save();
        return res.status(201).send(data);
    } catch (err) {
        res.locals.endpoint = 'createNewLifestage';
        return next(err);
    };  
};


// PUT

const updateLifestage = async (req, res, next) => {
    try {
        const newData = {
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            title: req.body.title,
            description: req.body.description,
            soft_skills: req.body.soft_skills,
            hard_skills: req.body.hard_skills,
            achievements: req.body.achievements,
            type: req.body.type,
            background_col: req.body.background_col,
            link: req.body.link,
            images: req.body.images,
            front_image: req.body.front_image
        };
    
        const updatedData = await Lifestage.findByIdAndUpdate(req.params.id, newData, { new: true });
        if (updatedData) return res.status(200).send(updatedData);
        else return res.status(404).send('Nothing found matching that ID');
    } catch (err) {
        res.locals.endpoint = 'updateLifestage';
        return next(err);
    };
};


// PATCH

const patchById = async (req, res, next) => {
    try {
        let updatedData;
        if (req.body.op === 'replace') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $set: { [req.body.path]: req.body.value } });
        else if (req.body.op === 'add') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $push: { [req.body.path]: req.body.value } });
        else if (req.body.op === 'remove') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $pull: { [req.body.path]: req.body.value } });
        else if (req.body.op === 'increment') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $inc: { [req.body.path]: req.body.value } });
    
        if (updatedData) return res.status(200).send(updatedData);
        else return res.status(404).send('No match found for that operation');
    } catch (err) {
        res.locals.endpoint = 'patchById';
        return next(err);
    };
};


// DELETE

const deleteByQuery = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length) {
            const data = await Lifestage.deleteMany(req.query);
            if (data.deletedCount) return res.status(200).send(data);
            else return res.status(404).send('No matching item found');
        } else {
            throw Error('You are not permitted to delete all documents');
        };
    } catch (err) {
        res.locals.endpoint = 'deleteByQuery';
        return next(err);
    };
};

const deleteById = async (req, res, next) => {
    try {
        const data = await Lifestage.findByIdAndDelete(req.params.id);
        if (data) return res.status(200).send('Item successfully deleted');
        else return res.status(404).send('No matching item found');
    } catch (err) {
        res.locals.endpoint = 'deleteById';
        return next(err);
    };
};

module.exports = {
    getAllLifestages: getAllLifestages,
    getOneLifestage: getOneLifestage,
    getSkills: getSkills,
    createNewLifestage: createNewLifestage,
    updateLifestage: updateLifestage,
    patchById: patchById,
    deleteById: deleteById,
    deleteByQuery: deleteByQuery
};