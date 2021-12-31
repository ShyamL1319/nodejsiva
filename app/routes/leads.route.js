const router = require('express').Router()
const leadController = require('../controllers/leads.controller')
const  uploadFile = require("../middlewares/upload.middleware");
router.post('/', leadController.add);
router.get('/', leadController.getAll);
router.get('/:id', leadController.getData);
router.patch('/bulk', leadController.bupdate);
router.patch('/:id', leadController.update);
router.delete('/:id', leadController.delete);
router.post("/bulk", uploadFile.single("file"), leadController.upload);
router.get('/download/:filename', leadController.download);
module.exports = router