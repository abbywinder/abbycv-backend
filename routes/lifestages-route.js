const express = require('express');
const { getAllLifestages, createNewLifestage, getOneLifestage, updateLifestage, deleteById, patchById, deleteByQuery, getSkills } = require('../controllers/lifestages-controller');
const { secureEndpoint } = require('../middleware/secure-endpoint');

const router = express.Router();

router.route('/')
.get(getAllLifestages)
.post(secureEndpoint, createNewLifestage)
.delete(secureEndpoint, deleteByQuery);

router.route('/skills/')
.get(getSkills);

router.route('/:id')
.get(getOneLifestage)
.put(secureEndpoint, updateLifestage)
.patch(secureEndpoint, patchById)
.delete(secureEndpoint, deleteById);
    
module.exports = router;