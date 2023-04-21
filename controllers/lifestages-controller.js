const Lifestage = require('../models/Lifestage');

// GET

const getAllLifestages = async (req, res) => {
    try {
        const data = await Lifestage.find({});
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
    const newLifestage = new Lifestage ({
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        title: req.body.title,
        description: req.body.description,
        soft_skills: req.body.soft_skills,
        hard_skills: req.body.hard_skills,
        achievements: req.body.achievements
    });
    
    try {
        newLifestage.save()
        .then(data => res.status(201).send(data));
    } catch (err) {
        return res.status(500).send(err.message);
    };  
};


// PUT

const updateLifestage = async (req, res) => {
    const newData = {
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        title: req.body.title,
        description: req.body.description,
        soft_skills: req.body.soft_skills,
        hard_skills: req.body.hard_skills,
        achievements: req.body.achievements
    };
    
    try {
        const updatedData = await Lifestage.findByIdAndUpdate(req.params.id, newData, { new: true });
        if (updatedData) return res.status(200).send(updatedData);
        else return res.status(404).send('Nothing found matching that ID');
    } catch (err) {
        return res.status(500).send(err.message);
    };
};


// PATCH

const patchById = async (req, res) => {

    let updatedData;
    if (req.body.op === 'replace') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $set: { [req.body.path]: req.body.value } });
    else if (req.body.op === 'add') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $push: { [req.body.path]: req.body.value } });
    else if (req.body.op === 'remove') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $pull: { [req.body.path]: req.body.value } });
    else if (req.body.op === 'increment') updatedData = await Lifestage.updateOne({ _id: req.params.id }, { $inc: { [req.body.path]: req.body.value } });
    
    try {
        if (updatedData) return res.status(200).send(updatedData);
        else return res.status(404).send('No match found for that operation');
    } catch (err) {
        return res.status(500).send(err.message);
    };
};


// DELETE

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
    deleteById: deleteById
};