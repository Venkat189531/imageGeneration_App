const {createClient}=require("@supabase/supabase-js");


// import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wyahjkyiumfiaonqpxjr.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
async function uploadBase64toImage(base64Data){
    try{
        // base64Image=`data:image/jog;base64,${base64Data}`;
        const fileName=`${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const buffer=Buffer.from(base64Data,"base64");
        const {data,error}=await supabase.storage.from("v-ai").upload(`public/${fileName}.png`,
            buffer,{
                contentType:'image/jpeg'
            }
        )
        if(error){
            throw error;
        }
        const imageUrl=`${supabaseUrl}/storage/v1/object/public/${data.fullPath}`
        console.log('imageUrl:',imageUrl);
        return imageUrl;
    }catch(error){
        console.log('error:',error)
    }
} 

module.exports={
    uploadBase64toImage
}