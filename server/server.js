const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const host = '0.0.0.0'; // Listen on all network interfaces

// Enable CORS for all routes
app.use(cors());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Endpoint to upload a single file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send(`File uploaded successfully: ${req.file.originalname}`);
});

// Endpoint to get the list of uploaded files
app.get('/files', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Failed to list files:', err);
      return res.status(500).send('Unable to list files.');
    }
    res.json(files);
  });
});

// Endpoint to delete a file
app.delete('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete ${filename}:`, err);
      if (err.code === 'ENOENT') {
        return res.status(404).send('File not found.');
      }
      return res.status(500).send('Error deleting file.');
    }
    res.status(200).send(`File deleted: ${filename}`);
  });
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
  console.log('Now accessible on your local network!');
});
