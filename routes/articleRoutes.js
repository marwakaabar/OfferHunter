const express = require('express');
const router = express.Router();
const Article = require('../models/Article'); 
const ObjectID = require('mongoose').Types.ObjectId;

// Récupérer tous les articles
router.get('/', async (req, res) => {
    const sort = req.query.sort;
    const filter = JSON.parse(req.query.filter);
    const { id, title, description, tags, q } = filter;
    let sortCriteria = sort.split('"')[1];
    if (sortCriteria === 'id') sortCriteria = '_id';
    let sortOrder = 0;
    if (sort.split('"')[3] === 'ASC') sortOrder = 1; else sortOrder = -1;

    try {
        const articles = await Article.find(
            (q && q.trim() && { $or: [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }, { tags: { $regex: q, $options: 'i' } }] })
            || (title && title.trim() && { title: { $regex: title, $options: 'i' } })
            || (description && description.trim() && { description: { $regex: description, $options: 'i' } })
            || (tags && tags.trim() && { tags: { $regex: tags, $options: 'i' } })
        ).sort([[sortCriteria, sortOrder]]);

        const formattedArticles = articles.map(article => ({
            id: article._id,
            title: article.title,
            description: article.description,
            image: article.image,
            tags: article.tags,
            createdAt: article.createdAt,
        }));

        if (id) {
            if (!ObjectID.isValid(id))
                return res.status(400).send('ID unknown : ' + id);
            const article = await Article.findById(id);
            if (article) {
                return res.status(200).json({
                    id: article._id,
                    title: article.title,
                    description: article.description,
                    image: article.image,
                    tags: article.tags,
                    createdAt: article.createdAt,
                });
            } else {
                return res.status(404).send('Article not found');
            }
        } else {
            res.status(200).json(formattedArticles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

// Récupérer un article par ID
router.get('/:id', async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.send({
            id: article._id,
            title: article.title,
            description: article.description,
            image: article.image,
            tags: article.tags,
            createdAt: article.createdAt,
        });
    } catch (err) {
        console.log('Error finding article: ' + err);
        res.status(500).send(err);
    }
});

// Mettre à jour un article par ID
router.put('/:id', async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    const updatedRecord = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        tags: req.body.tags,
    };

    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { $set: updatedRecord },
            { new: true }
        );
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.send({
            id: article._id,
            title: article.title,
            description: article.description,
            image: article.image,
            tags: article.tags,
            createdAt: article.createdAt,
        });
    } catch (err) {
        console.log("Update error : " + err);
        res.status(400).send(err);
    }
});

// Supprimer un article par ID
router.delete('/:id', async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Article ID unknown : ' + req.params.id);

    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.status(200).json({ message: "Article successfully deleted." });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
});

module.exports = router;
