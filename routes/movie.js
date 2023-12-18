const express = require('express')
const router = express.Router()
const MovieController = require('../controller/movie_controller')
const auth = require('../middleware/auth')
// const upload = require('../middleware/multer')

router.get('/', MovieController.getSemua)
router.get('/:id', MovieController.getOne)
router.post('/', auth, MovieController.create)
router.put('/:id', auth , MovieController.update)
router.delete('/:id', auth , MovieController.delete)
// router.post('/:id/upload',upload.single('photo'), MovieController.uploadImage);

module.exports = router;