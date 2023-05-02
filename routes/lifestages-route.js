const express = require('express');
const { getAllLifestages, createNewLifestage, getOneLifestage, updateLifestage, deleteById, patchById, deleteByQuery } = require('../controllers/lifestages-controller');

const router = express.Router();

router.route('/')
.get(getAllLifestages)
.post(createNewLifestage)
.delete(deleteByQuery);

router.route('/:id')
.get(getOneLifestage)
.put(updateLifestage)
.patch(patchById)
.delete(deleteById);
    
module.exports = router;