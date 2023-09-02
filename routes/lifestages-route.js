const express = require('express');
const { getAllLifestages, createNewLifestage, getOneLifestage, updateLifestage, deleteById, patchById, deleteByQuery, getSkills } = require('../controllers/lifestages-controller');
const { addRoleAdminOnly, addRoleVisitor, ensureAuthenticatedAndAuthorised } = require('../middleware/auth');

const router = express.Router();

router.route('/')
.get(addRoleVisitor, ensureAuthenticatedAndAuthorised, getAllLifestages)
.post(addRoleAdminOnly, ensureAuthenticatedAndAuthorised, createNewLifestage)
.delete(addRoleAdminOnly, ensureAuthenticatedAndAuthorised, deleteByQuery);

router.route('/skills/')
.get(addRoleVisitor, ensureAuthenticatedAndAuthorised, getSkills);

router.route('/:id')
.get(addRoleVisitor, ensureAuthenticatedAndAuthorised, getOneLifestage)
.put(addRoleAdminOnly, ensureAuthenticatedAndAuthorised, updateLifestage)
.patch(addRoleAdminOnly, ensureAuthenticatedAndAuthorised, patchById)
.delete(addRoleAdminOnly, ensureAuthenticatedAndAuthorised, deleteById);
    
module.exports = router;