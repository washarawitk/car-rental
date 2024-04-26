const router = require('express').Router();
const {Uploadimage} = require('../controllers/uploadimage');
const {protect,authorize}=require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
  });


const upload = multer({ storage: storage });
router.route('/').post(protect,authorize('admin','user'),upload.single('image'),Uploadimage);

module.exports=router;

