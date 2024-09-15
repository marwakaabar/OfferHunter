const fs = require('fs');
const path = require('path');
const { Readable } = require('stream'); // Import Readable from 'stream'
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const UserModel = require('../models/userModel'); // Adjust the path as needed

module.exports.uploadProfil = async (req, res) => {
    try {
        console.log("Received file:", req.file); // Debug log

        if (!req.file) throw Error("No file uploaded");

        if (
            req.file.mimetype !== "image/jpg" &&
            req.file.mimetype !== "image/jpeg" &&
            req.file.mimetype !== "image/png"
        ) throw Error("Invalid file format");

        if (req.file.size > 500000) throw Error("File too large");

        const fileName = req.body.userId + Date.now() + ".jpg";
        const filePath = path.join(__dirname, '../client/public/uploads/profil', fileName);

        // Create a readable stream from the buffer
        const readableStream = Readable.from(req.file.buffer);
        const writeStream = fs.createWriteStream(filePath);

        // Use pipeline to handle the stream
        await pipeline(
            readableStream,
            writeStream
        );

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: "/uploads/profil/" + fileName } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).send(updatedUser);

    } catch (err) {
        console.error("Upload error:", err);
        res.status(400).send({ message: uploadErrors(err) });
    }
};
