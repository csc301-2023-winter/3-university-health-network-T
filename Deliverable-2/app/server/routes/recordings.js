const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');
const multer = require('multer');
const azure = require('azure-storage');
const ver_tools = require('../tools/verifiers');
const blobService = azure.createBlobService('DefaultEndpointsProtocol=https;AccountName=nathanstorageacc;AccountKey=85KldYJGMTuKkFBo4mjybea1iQKgdoO7RVGJkady7urYYOltyvxyyO1+mKsRxyv4rWeFSzeuTTZE+AStqcWHgQ==;EndpointSuffix=core.windows.net'); 
const videoContainerName = 'videos';
const jointContainerName = 'joints';

const videoStorage = multer.memoryStorage();
const videoUpload = multer({
    storage: videoStorage
});

const jointStorage = multer.memoryStorage();
const jointUpload = multer({
    storage: jointStorage
});

blobService.createContainerIfNotExists(videoContainerName, (err, result) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(`Container '${videoContainerName}' created or already exists.`);
});

blobService.createContainerIfNotExists(jointContainerName, (err, result) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(`Container '${jointContainerName}' created or already exists.`);
});

router.post('/upload/video', videoUpload.single('video'), (req, res) => {
    console.log(req.headers)
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    const video = req.file;
    let d = new Date()
    const blobName = ('video'+pid+req.body.Time+(''+(new Date()))).replaceAll(' ','-').replaceAll(':','_')//video.originalname;
    const contentType = video.mimetype;

    blobService.createBlockBlobFromText(videoContainerName, blobName, video.buffer, { contentType }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        const videoUrl = blobService.getUrl(videoContainerName, blobName);
        pool.query('SELECT Count(*) FROM RecordedVideo',[],(err,result)=>{
            console.log(result.rowCount)
            console.log(Number(result.rows[0].count))
            pool.query('INSERT INTO RecordedVideo (PatientID, VideoID, Date, Time, Format, Path) VALUES ($1, $2, $3, $4, $5, $6)', [pid, Number(result.rows[0].count)+1, req.body.Date, req.body.Time, '.MP4', videoUrl], (err, result) => {
            
                console.log(err)
                console.log(videoUrl)
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
        
                    res.status(200).json({
                        message: "video uploaded and stored successfully",
                        data: {
                            video_url: videoUrl
                        }
                    });
                });
        })

        
    });
});

router.post('/upload/joints', jointUpload.single('joints'), (req, res) => {
    const pid = ver_tools.login_ver(req.headers.authorization.split(' ')[1]);
    console.log(pid);
    if (pid < 0) {
        res.sendStatus(403);
        return;
    }
    const joints = req.file;
    const blobName = joints.originalname;
    const contentType = joints.mimetype;

    blobService.createBlockBlobFromText(jointContainerName, blobName, joints.buffer, { contentType }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        const jointsUrl = blobService.getUrl(jointContainerName, blobName);

        pool.query('INSERT INTO RecordedBodyJoints (PatientID, BodyJointsID, Date, Time, Format, Path) VALUES ($1, $2, $3, $4, $5, $6)', [pid, req.body.BodyJointsID, req.body.Date, req.body.Time, '.JSON', jointsUrl], (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.status(200).json({
                message: "joints uploaded and stored successfully",
                data: {
                    joints_url: jointsUrl
                }
            });
        });
    });
});

module.exports = router;