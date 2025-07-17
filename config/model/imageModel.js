const mongoose=require("mongoose")
const imageSchema=new mongoose.Schema({
    prompt:{
        type:String,
        require:true,
        trime:true,//space remove in prompt
    },
    imageUrl:{
        type:String,
        require:true,

    }
},{
    timestamps:true,
    versionKey:false
})

const ImageModel=mongoose.model("Image",imageSchema)
module.exports=ImageModel;