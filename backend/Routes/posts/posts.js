const express = require('express');
const multer = require('multer');
const postController = require('../../controllers/postController');
const commentRoutes = require('./comments');
const checkAuth = require('../../Middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg'
}

const postImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error("Invalid mime type.");
        if(isValid) {
            err = null;
        }
        cb(err, './backend/images/posts');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.get('', postController.getAllPosts);

router.get('/:id', postController.getPostByPostId);

router.get('/user/:id', postController.getPostByUserId);

router.post('', checkAuth, multer({storage: postImgStorage}).single('image'), postController.addNewPost);

router.put('/edit/:id', checkAuth, multer({storage: postImgStorage}).single('image'), postController.editPost);

router.delete('/delete/:id', checkAuth, postController.deletePost);

router.put('/upvote/:id', checkAuth, postController.upvotePost);

router.put('/downvote/:id', checkAuth, postController.downvotePost);

router.use('/comment', commentRoutes);

module.exports = router;