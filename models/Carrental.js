const mongoose=require('mongoose');

const CarrentalSchema=new mongoose.Schema({
    apptDate:{
        type: Date,
        required: true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    carprovider:{
        type:mongoose.Schema.ObjectId,
        ref: 'Carprovider',
        require:true
    },
    createdAt:{
        type : Date,
        default: Date.now
    }
});
module.exports=mongoose.model('Carrental', CarrentalSchema);