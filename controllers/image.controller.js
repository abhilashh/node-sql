function upload(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = req.file.filename;
    res.status(201).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl
    });
}

module.exports = { upload: upload };