const express = require('express');
const router = express.Router();
const multer = require('multer');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.render('record');
});

router.post('/submit', upload.single('video'), (req, res) => {
  // it can only send a response to show video pass to backend successfully,
  // TODO: after db connection, we should truely seng the video
  console.log("Upload success")
  res.status(200).json({ message: 'Upload success' });
  // // following part is an idea to submit a video to db, but need to wait db ready to test.
  // const blobServiceClient = new BlobServiceClient(connectionString);

  // // Get a reference to a container
  // const containerClient = blobServiceClient.getContainerClient(containerName);

  // // Create a unique blob name
  // const blobName = `${Date.now()}-$-${req.file.originalname}`;

  // // Get a reference to a blob
  // const blobClient = containerClient.getBlobClient(blobName);

  // // Upload the video to the blob
  // const stream = require('stream');
  // const bufferStream = new stream.PassThrough();
  // bufferStream.end(req.file.buffer);
  // blobClient.uploadStream(bufferStream, {
  //   blobHTTPHeaders: { blobContentType: req.file.mimetype }
  // }).then((result) => {
  //   console.log("Upload success!");
  //   res.json({ message: 'Upload success' });
  // }).catch((err) => {
  //   console.error(err);
  //   res.status(500).json({ message: 'Upload failed' });
  // });
});

module.exports = router;
