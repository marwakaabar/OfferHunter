const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const ObjectID = require('mongoose').Types.ObjectId;
const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');
const { uploadErrors } = require('../utils/errorsUtils'); // Assurez-vous que cette fonction est définie

module.exports.postInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    PostModel.findById(req.params.id, (err, docs) => {
        if (err) {
            console.log('ID unknown: ' + err);
            return res.status(500).send('Error: ' + err);
        }
        res.send(docs);
    });
};

module.exports.readPost = (req, res) => {
    PostModel.find()
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
            if (err) {
                console.log("Error getting data: " + err);
                return res.status(500).send('Error: ' + err);
            }
            res.send(docs);
        });
};

module.exports.createPost = async (req, res) => {
    let fileName;

    if (req.file) {
        try {
            const validMimeTypes = ["image/jpg", "image/jpeg", "image/png"];
            if (!validMimeTypes.includes(req.file.mimetype)) throw new Error("Invalid file format");
            if (req.file.size > 500000) throw new Error("File too large");

            fileName = req.body.posterId + Date.now() + ".jpg";
            const filePath = path.join(__dirname, '../client/public/uploads/posts', fileName);

            // Create a readable stream from the buffer
            const readableStream = Readable.from(req.file.buffer);
            const writeStream = fs.createWriteStream(filePath);

            // Use pipeline to handle the stream
            await pipeline(
                readableStream,
                writeStream
            );
        } catch (err) {
            const errors = uploadErrors(err);
            return res.status(400).json({ errors });
        }
    }

    const newPost = new PostModel({
        postType: req.body.postType,
        posterId: req.body.posterId,
        posterPic: req.body.posterPic,
        posterName: req.body.posterName,
        title: req.body.title,
        description: req.body.description,
        picture: req.file ? "/uploads/posts/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [],
        cord: req.body.cord,
        price: req.body.price,
        phonenumber: req.body.phonenumber,
        stock: req.body.stock,
        state: req.body.state,
        availability: req.body.availability,
        tags: req.body.tags,
    });

    try {
        const post = await newPost.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).send('Error: ' + err);
    }
};

module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown: " + req.params.id);
    }

    const updatedRecord = {
        title: req.body.title,
        phonenumber: req.body.phonenumber,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        state: req.body.state,
        availability: req.body.availability,
        tags: req.body.tags,
    };

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (err) {
                console.log("Update error: " + err);
                return res.status(500).send('Error: ' + err);
            }
            res.send(docs);
        }
    );
};

module.exports.updatePostPic = async (req, res) => {
    try {
        const validMimeTypes = ["image/jpg", "image/jpeg", "image/png"];
        if (!validMimeTypes.includes(req.file.mimetype)) throw new Error("Invalid file format");
        if (req.file.size > 500000) throw new Error("File too large");

        const fileName = req.body.postId + Date.now() + ".jpg";
        const filePath = path.join(__dirname, '../client/public/uploads/posts', fileName);

        // Create a readable stream from the buffer
        const readableStream = Readable.from(req.file.buffer);
        const writeStream = fs.createWriteStream(filePath);

        // Use pipeline to handle the stream
        await pipeline(
            readableStream,
            writeStream
        );

        const updatedPost = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $set: { picture: "/uploads/posts/" + fileName } },
            { new: true }
        );
        res.send(updatedPost);
    } catch (err) {
        const errors = uploadErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Post ID unknown: ' + req.params.id);
    }

    try {
        await PostModel.deleteOne({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Post successfully deleted." });
    } catch (err) {
        res.status(500).send('Error: ' + err);
    }
};

module.exports.addToCart = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown: " + req.params.id);
    }

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { addersToCart: req.body.id } },
            { new: true }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
            { $addToSet: { addedToCart: req.params.id } },
            { new: true }
        );

        res.status(200).send('Added to cart successfully.');
    } catch (err) {
        res.status(500).send('Error: ' + err);
    }
};

module.exports.removeFromCart = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown: " + req.params.id);
    }

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { addersToCart: req.body.id } },
            { new: true }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
            { $pull: { addedToCart: req.params.id } },
            { new: true }
        );

        res.status(200).send('Removed from cart successfully.');
    } catch (err) {
        res.status(500).send('Error: ' + err);
    }
};

// Comments handling
module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Post ID unknown: ' + req.params.id);
    }

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterUsername: req.body.commenterUsername,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true }
        );
        res.send(updatedPost);
    } catch (err) {
        res.status(400).send('Error: ' + err);
    }
};

module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Post ID unknown: ' + req.params.id);
    }

    try {
        const post = await PostModel.findById(req.params.id);
        const comment = post.comments.id(req.body.commentId);

        if (!comment) return res.status(404).send("Comment not found");

        comment.text = req.body.text;
        await post.save();
        res.status(200).send(post);
    } catch (err) {
        res.status(400).send('Error: ' + err);
    }
};

module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Post ID unknown: ' + req.params.id);
    }

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: { _id: req.body.commentId }
                }
            },
            { new: true }
        );
        res.send(updatedPost);
    } catch (err) {
        res.status(400).send('Error: ' + err);
    }
};
