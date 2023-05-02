const Lifestage = require('../models/Lifestage');
const { generateSortPipeline } = require('../pipelines/lifestage-pipelines');

// GET

const getAllLifestages = async (req, res) => {
    try {
        const pipeline = generateSortPipeline(req.query);
        const data = await Lifestage.aggregate(pipeline);
        if (data.length) return res.status(200).send(data);
        else return res.status(404).send('No data found');
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

const getOneLifestage = async (req, res) => {
    try {
        const data = await Lifestage.findById(req.params.id)
        if (data) return res.status(200).send(data);
        else return res.status(404).send('No data found matching that ID');
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

// POST

const createNewLifestage = async (req, res) => {
    try {
        const newLifestage = new Lifestage ({
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            title: req.body.title,
            description: req.body.description,
            soft_skills: req.body.soft_skills,
            hard_skills: req.body.hard_skills,
            achievements: req.body.achievements,
            type: req.body.type
        });
    
        const data = await newLifestage.save();
        return res.status(201).send(data);
    } catch (err) {
        return res.status(500).send(err.message);
    };  
};


// PUT

const updateLifestage = async (req, res) => {
    try {
        const newData = {
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            title: req.body.title,
            description: req.body.description,
            soft_skills: req.body.soft_skills,
            hard_skills: req.body.hard_skills,
            achievements: req.body.achievements,
            type: req.body.type
        };
    
        const updatedData = await Lifestage.findByIdAndUpdate(req.params.id, newData, { new: true });
        if (updatedData) return res.status(200).send(updatedData);
        else return res.status(404).send('Nothing found matching that ID');
    } catch (err) {
        return res.status(500).send(err.message);
    };
};


// PATCH

const patchById = async (req, res) => {
    try {
        let updatedData;
        if (req.body.op === 'replace') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $set: { [req.body.path]: req.body.value } });
        else if (req.body.op === 'add') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $push: { [req.body.path]: req.body.value } });
        else if (req.body.op === 'remove') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $pull: { [req.body.path]: req.body.value } });
        else if (req.body.op === 'increment') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $inc: { [req.body.path]: req.body.value } });
    
        if (updatedData) return res.status(200).send(updatedData);
        else return res.status(404).send('No match found for that operation');
    } catch (err) {
        return res.status(500).send(err.message);
    };
};


// DELETE

const deleteByQuery = async (req, res) => {
    try {
        if (Object.keys(req.query).length) {
            const data = await Lifestage.deleteMany(req.query);
            if (data.deletedCount) return res.status(200).send(data);
            else return res.status(404).send('No matching item found');
        } else {
            throw Error('You are not permitted to delete all documents');
        };
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

const deleteById = async (req, res) => {
    try {
        const data = await Lifestage.findByIdAndDelete(req.params.id);
        if (data) return res.status(200).send('Item successfully deleted');
        else return res.status(404).send('No matching item found');
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

module.exports = {
    getAllLifestages: getAllLifestages,
    getOneLifestage: getOneLifestage,
    createNewLifestage: createNewLifestage,
    updateLifestage: updateLifestage,
    patchById: patchById,
    deleteById: deleteById,
    deleteByQuery: deleteByQuery
};