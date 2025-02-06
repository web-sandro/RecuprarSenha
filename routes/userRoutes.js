const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

router.get('/', UserController.index);

router.get('/exibir/:id', UserController.show);

router.get('/cadastrar/', UserController.createForm);
router.post('/cadastrar/', UserController.create);

router.get('/atualizar/:id', UserController.editForm);
router.post('/atualizar/:id', UserController.edit);

router.get('/deletar/:id', UserController.deleteForm);
router.post('/deletar/:id', UserController.delete);

module.exports = router;