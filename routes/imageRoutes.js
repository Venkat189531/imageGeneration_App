const express=require("express");
const router=express.Router();
const {generateImage,getImage}=require("../controllers/imageControler")
router.post("/generate-image",generateImage)
router.get("/discover-image",getImage)
module.exports=router;
