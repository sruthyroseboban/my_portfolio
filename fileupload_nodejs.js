const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

let uploadfilename = '';

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        uploadfilename = Date.now() + '-' + file.originalname;
        cb(null, uploadfilename);
    }
});
const upload = multer({ storage: storage });

// CORS configuration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// POST endpoint for image upload
app.post('/api/image-upload', upload.single('file'), (req, res) => {
    return res.send(JSON.stringify({ "response": uploadfilename }));
});

// GET endpoint for image retrieval
app.get('/api/image/:p_image', (req, res) => {
    const imagePath = process.cwd() + `/uploads/${req.params.p_image}`;

    if (fs.existsSync(imagePath)) {
        fs.readFile(imagePath, function (err, image) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading file');
            }

            res.setHeader('Content-Type', 'image/jpg');
            res.send(image);
        });
    } else {
        res.status(404).send('Image not found');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
