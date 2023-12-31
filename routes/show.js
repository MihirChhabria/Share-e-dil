const express = require('express');
const router = require('express').Router();
const File = require('../models/file');



router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        // Link expired
        if(!file) {
            return res.render('download.ejs', { error: 'Link has been expired.'});
        } 
        return res.render('download.ejs', { uuid: file.uuid, fileName: file.filename, fileSize: file.size, downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` });
    } catch(err) {
        return res.render('download.ejs');
    }
});


module.exports = router;