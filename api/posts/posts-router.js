// implement your posts router here
const express = require('express');
const Post = require('./posts-model');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(() => {
            res.status(500).json({ message: "The posts information could not be retrieved" });
        })
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            post ? res.json(post) : res.status(404).json({ message: "The post with the specified ID does not exist" })
        })
        .catch(() => {
            res.status(500).json({ message: "The post information could not be retrieved" });
        })
});

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (title && contents) {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id);
            })
            .then(post => {
                res.status(201).json(post);
            })
            .catch(() => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    } else {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } 
});

router.put('/:id', (req, res) => {
    const { title, contents } = req.body;
    if (title && contents) {
        Post.findById(req.params.id)
        .then(stuff => {
            if (!stuff) {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                return Post.update(req.params.id, req.body);
            }
        })
        .then(() => {
            return Post.findById(req.params.id);
        })
        .then(post => {
            res.status(200).json(post)
        })
        .catch(() => {
            res.status(500).json({ message: "The post information could not be modified" }); 
        });
    } else {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post ? (await Post.remove(req.params.id), res.json(post)) : res.status(404).json({ message: "The post with the specified ID does not exist" });
    } catch {
        res.status(500).json({ message: "The post could not be removed" });
    }
});

router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
        .then(comments => {
            comments.length > 0 ? res.json(comments) : res.status(404).json({ message: "The post with the specified ID does not exist" });
        })
        .catch(() => {
            res.status(500).json({ message: "The comments information could not be retrieved" });
        });
});

module.exports = router;