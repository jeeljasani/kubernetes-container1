const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

console.log('container1');

app.use(express.json());

const PV_DIR = '/jeel_PV_dir';

app.post('/store-file', async (req, res) => {
    try 
    {
        if (!req.body || !req.body.hasOwnProperty('file') || req.body.file === null) {
            return res.status(400).json({
                "file": null,
                "error": "Invalid JSON input."
            });
        }

        const { file, data } = req.body;
        const filePath = path.join(PV_DIR, file);

        if (!fs.existsSync(PV_DIR)) {
            try {
                fs.mkdirSync(PV_DIR, { recursive: true });
            } catch (error) {
                console.error('Error creating directory:', error);
                return res.status(500).json({
                    "file": file,
                    "error": "Error while storing the file to the storage."
                });
            }
        }

        try {
            fs.writeFileSync(filePath, data);
            return res.status(200).json({
                "file": file,
                "message": "Success."
            });
        } catch (error) {
            console.error('Error writing file:', error);
            return res.status(500).json({
                "file": file,
                "error": "Error while storing the file to the storage."
            });
        }
    } catch (error) {
        console.error('General error:', error);
        return res.status(400).json({
            "file": null,
            "error": "Invalid JSON input."
        });
    }
});

app.post('/calculate', async (req, res) => {
    try {
        if (!req.body || !req.body.hasOwnProperty('file') || req.body.file === null) {
            return res.status(400).json({
                "file": null,
                "error": "Invalid JSON input."
            });
        }

        try {
            const response = await axios.post('http://container2-service:5000/process', {
                file: req.body.file,
                product: req.body.product
            });
            
            return res.status(response.status).json(response.data);
        } catch (error) {
            if (error.response) {
                return res.status(error.response.status).json(error.response.data);
            }
            throw error;
        }
    } catch (error) {
        return res.status(400).json({
            "file": null,
            "error": "Invalid JSON input."
        });
    }
});

app.post('/start', (req, res) => {
    const { banner, ip } = req.body;
    if (!banner || !ip) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log(`Received start request - Banner: ${banner}, IP: ${ip}`);
    return res.status(200).json({ message: 'Service started successfully' });
});

const PORT = 6000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Container 1 listening on port ${PORT}`);
});