const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://guntakantinarayana18:Narivirat@cluster0.4lmer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    
        });
        console.log("✅ DB Connected Successfully");
    } catch (error) {
        console.error("❌ Error while connecting to DB:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
// mongoose.connect('mongodb://guntakantinarayana18:Narivirat@1123@your-cluster.mongodb.net/database', {
        
// })
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.error('Connection Error:', err));
// };