const express = require('express');
const multer = require('multer');
const userController = require('../controllers/usersController');
const checkAuth = require('../Middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg'
}

const profileImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error("Invalid mime type.");
        if(isValid) {
            err = null;
        }
        cb(err, './backend/images/users');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '.' + ext);
    }
});

router.post('/login', userController.login);

router.post('/sign-up', userController.signUp);

router.get('/:id', checkAuth, userController.getUserProfile);

router.put('/:id', checkAuth,  multer({storage: profileImgStorage}).single('image'), userController.editUserProfile);

router.get('/friends/:id', checkAuth, userController.getUserFriends);

router.get('/friend-requests/:id', checkAuth, userController.getUserFriendRequests)

router.put('/friend/:id', checkAuth, userController.sendFriendRequest);

router.put('/accept-friend/:id', checkAuth, userController.acceptFriendRequest);

router.put('/reject-friend/:id', checkAuth, userController.rejectFriendRequest);

router.delete('/delete-friend/:id', checkAuth, userController.deleteFriendRequest);

// router.delete('/delete-account/:id', checkAuth, userController.deleteUserAccount);

module.exports = router;