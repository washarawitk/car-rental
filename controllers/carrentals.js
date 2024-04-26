const { application } = require('express');
const Carrental = require('../models/Carrental');
const Carprovider = require('../models/Carprovider');

 
const express = require('express');
const multer = require('multer');

exports.getCarrentals=async (req, res, next)=>{
    let query;
    console.log(req.user)
    if(req.user.role !== 'admin'){
        query=Carrental.find({user:req.user.id}).populate({
            path:'carprovider',
            select: 'name province tel'
        });
    }else{
        if(req.params.carproviderId){
            console.log(req.params.carproviderId);
            query=Carrental.find({carprovider:req.params.carproviderId }).populate({
                path:'carprovider',
                select: 'name province tel'
            });
        }else {
            query=Carrental.find().populate({
                path:'carprovider',
                select: 'name province tel'
            });
        }
        
    }
    try{
        const carrentals=await query;

        res.status(200).json({
            success:true,
            count:carrentals.length,
            data:carrentals
            
        });

    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success:false,
            message:"Cannot find Carrental"
        });

    }
}

exports.getCarrental=async(req,res,next)=>{
    try{
        const carrental=await Carrental.findById(req.params.id).populate({
            path:'carprovider',
            select:'name description tel'
        });
        if(!carrental){
            return res.status(404).json({success:false,message:`No carrental with the id of ${req.params.id}`});
        }
        res.status(200).json({
            success:true,
            data: carrental
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot find Carrental'});
    }
}

exports.addCarrental=async(req,res,next)=>{
    try{
        req.body.carprovider=req.params.carproviderId;
        const carprovider=await Carprovider.findById(req.params.carproviderId);

        if(!carprovider){
            return res.status(404).json({ success:false,message: `No carprovider with the id of  ${req.params.carproviderId}`});
        }
        console.log(req.body);

        //add user id req 

        req.body.user=req.user.id;
        const existedCarrentals=await Carrental.find({user:req.user.id});
        if(existedCarrentals.length>= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The  user with ID ${req.user.id} has already made 3 carrentals`});
        }


        const carrental = await Carrental.create(req.body);
        res.status(200).json({
            success:true,
            data:carrental
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot  create Carrental'});
    }
}

exports.updateCarrental=async (req,res,next)=>{
    try{
        let carrental=await Carrental.findById(req.params.id);
        if(!carrental){
            return res.status(404).json({success:false,message: `No carrental with the id of ${req.params.id}`});
        }

       
        if(carrental.user.toString()!==req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this carrental`});
        }



        carrental=await Carrental.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: carrental
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot update Carrental'});
    }
}


exports.deleteCarrental=async (req,res,next)=>{
    try{
        const carrental=await Carrental.findById(req.params.id);
        
        if(!carrental){
            return res.status(404).json({success:false,message:`No carrental with the id of ${req.params.id}`});
        }
        await carrental.deleteOne();

        res.status(200).json({
            success:true,
            data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot delete Carrental'});
    }
};

//test upload 



const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
  });
  
  const upload = multer({ storage: storage });
  
  
  app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
      res.json({
        success: true,
        message: 'Image uploaded!',
        fileInfo: req.file
      });
    } else {
      res.status(400).send('No image uploaded');
    }
  });
  