const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid} = require('uuid');
const { FILE } = require('dns');




let storage = multer.diskStorage({
    destination: (req, res, callback) => callback(null, 'uploads/'),
    filename: (req, file, callback) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E8)}${path.extname(file.originalname)}`;
        callback(null, uniqueName);
    }
})


let upload = multer({
    storage: storage,
    limit: { filesize: 1000000 * 1000},
}).single('myFile');

router.post('/', (req,res) => {
    //Validate request

    //store files
    upload(req, res,async (err) => {

        if(!req.file){
            return res.json({ error: 'All fields are required.'});
        }

        if(err){
            return res.status(500).send({ error: err.message});
        }
 //store in DB
        
        const file = new File({
            filename: req.file.filename,
            uuid: uuid(),
            path: req.file.path,
            size: req.file.size

        });

        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
    });
    //response --> link

});

router.post('/send',async (req, res)=> {
    const { uuid, emailTo, emailFrom } = req.body;

    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({ error: 'All fields are required.'});
    }

    //get data from db

    const file = await File.findOne({ uuid: uuid });

    if(file.sender) {
        return res.status(422).send({ error: 'Email already sent.'});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //send email
    const SendMail = require('../services/emailService');
    SendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'Share-E-Dil file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000) + ' KB',
            expires: '24 hours'
        })
    });

    return res.send({ success: true});

});

module.exports = router;