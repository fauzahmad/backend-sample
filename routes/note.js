let express = require('express')
let router = express.Router();
let {body} = require('express-validator');
let noteController = require('../controllers/note')

router.post('/create', body(['data.title', 'data.description']).isLength({min: 1}), noteController.createNote)
router.get('/get_note/:noteId', noteController.readOneNote)
router.get('/get_notes', noteController.readAllNotes)
router.put('/update', body(['data.title', 'data.description']).isLength({min: 1}), noteController.updateNote)
router.delete('/delete_node/:noteId', noteController.deleteNote)

module.exports = router;