let mongoose = require('mongoose');
let note = mongoose.model('Note');
let {errorResponse} = require('../helpers/error');
let {validationResult} = require("express-validator");
let {noteValidationSchema} = require("../helpers/user.schema");

module.exports.createNote = function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, "Missing Fields or Empty", 400, errors.array({onlyFirstError: true}))
        }

        const {data} = req.body
        const validate = noteValidationSchema(data)
        if (validate.error) {
            errorResponse(res, "Field missing", 400, validate.error.details[0])
        }

        note.create(req.body.data).then(noteCreated => {
            res.status(200).send({
                success: true,
                message: 'Note created',
                data: noteCreated
            })
        }).catch(err => {
            errorResponse(res, 'Note not created', 400, err)
        })


    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }


}

module.exports.readOneNote = function (req, res) {

    try {
        let noteId = req.params.noteId;

        note.findById(
            req.body.data.id,
            {},
            {}
        ).then(noteRecord => {
            res.status(200).send({
                success: true,
                data: noteRecord
            })
        }).catch(err => {
            errorResponse(res, 'Note record not found', 400, err)
        })


    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }

}

module.exports.readAllNotes = function (req, res) {

    try {

        note.find(
            {},
            {},
            {}
        ).then(noteRecords => {
            res.status(200).send({
                success: true,
                data: noteRecords
            })
        }).catch(err => {
            errorResponse(res, 'Note records not found', 400, err)
        })


    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }

}

module.exports.updateNote = function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, "Missing Fields or Empty", 400, errors.array({onlyFirstError: true}))
        }

        const {data} = req.body
        const validate = noteValidationSchema(data)
        if (validate.error) {
            errorResponse(res, "Field missing", 400, validate.error.details[0])
        }

        note.findByIdAndUpdate(
            req.body.data.id,
            {
                title: req.body.data.title,
                description: req.body.data.description
            },
            {upsert: true}
        ).then(noteUpdated => {
            res.status(200).send({
                success: true,
                message: 'Note updated',
                data: noteUpdated
            })
        }).catch(err => {
            errorResponse(res, 'Note not updated', 400, err)
        })


    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }

}

module.exports.deleteNote = function (req, res) {

    try {
        let noteId = req.params.noteId;

        note.findOneAndDelete(
            req.body.data.id,
            {}
        ).then(noteDeleted => {
            res.status(200).send({
                success: true,
                message: 'Note deleted',
                data: noteDeleted
            })
        }).catch(err => {
            errorResponse(res, 'Note record not found', 400, err)
        })


    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }

}