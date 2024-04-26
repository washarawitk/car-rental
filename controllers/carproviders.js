const Carprovider = require('../models/Carprovider');


exports.getCarproviders= async (req,res,next) => {
    let query;



// copy req.query eiei
    const reqQuery={...req.query};

    const removeFields=['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

//create query string 

    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);

    query = Carprovider.find(JSON.parse(queryStr)).populate('carrentals');



    //select  
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');
    }

    //pagination 

    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
   // const total=await Hospital.countDocuments();

    try{
        const total=await Carprovider.countDocuments();
        query=query.skip(startIndex).limit(limit);

        const carproviders = await query;

        const pagination={};

        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }
        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }

        res.status(200).json({success:true, count:carproviders.length, data:carproviders});
    } catch(err){
        res.status(400) .json({success:false});
    }
};

exports.getCarprovider= async (req,res,next) => {
    try{
		const carprovider = await Carprovider.findById(req.params.id);
		if(!carprovider){
			return res.status(400).json({success:false});
        }
		
		res.status(200).json({success:true,data:carprovider});
	} catch(err){
		res.status(400).json({success:false});
	}
};


exports.createCarprovider= async(req,res,next) => {
    //console.log(req.body);
    const carprovider= await Carprovider.create(req.body);
    res.status(201).json({success:true, data:carprovider});
}

exports.updateCarprovider= async(req,res,next) =>  {
try{
    const carprovider = await Carprovider.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    })

    if(!carprovider){
        return res.status(400).json({success:false});
    }
    res.status(200).json({success:true, data: carprovider });
} catch(err){
    res.status(400).json({success:false});
}
}

exports.deleteCarprovider= async(req,res,next) => {
    try{
        const carprovider = await Carprovider.findById(req.params.id);

        if(!carprovider)
            return res.status(400).json({success:false});

        await carprovider.deleteOne();
        res.status(200).json({success:true, data: carprovider });
    } catch(err){
        console.log(err)
        res.status(400).json({success:false});
    }
}
 
