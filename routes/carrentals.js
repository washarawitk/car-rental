const express=require('express');
const {getCarrentals,getCarrental,addCarrental, updateCarrental, deleteCarrental}=require('../controllers/carrentals');

const router = express.Router({mergeParams:true});

const {protect,authorize}=require('../middleware/auth');

router.route('/').get(protect, getCarrentals).post(protect,authorize('admin','user'),addCarrental);
router.route('/:id').get(protect,getCarrental).put(protect,authorize('admin','user'),updateCarrental).delete(protect,authorize('admin','user'),deleteCarrental);

module.exports=router;

