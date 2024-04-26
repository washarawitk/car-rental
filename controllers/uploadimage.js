const express = require('express');
exports.Uploadimage =async(req,res,next)=>{
  if (req.file) {
    res.json({
      success: true,
      message: 'Image uploaded!',
      fileInfo: req.file
    });
  } else {
    res.status(400).send('No image uploaded');
  }
}

