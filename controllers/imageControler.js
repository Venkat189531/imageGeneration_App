const Together = require("together-ai").default;
const { uploadBase64toImage } = require("../utils");
const ImageModel = require("../config/model/imageModel");

const apiKey = process.env.TOGETHER_API_KEY;

const generateImage = async (req, res) => {
    if (!apiKey) {
        return res.status(500).json({ error: "API key is missing" });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const together = new Together({ apiKey });

        let response = await together.images.create({
            prompt,
            model: "black-forest-labs/FLUX.1-schnell-Free",
            width: 1024,
            height: 768,
            steps: 4,
            n: 1,
            response_format: "b64_json",
            stop: []
        });

        const base64Image = response?.data?.[0]?.b64_json;
        if (!base64Image) {
            return res.status(500).json({ error: "Failed to retrieve image data" });
        }

        const imageUrl = await uploadBase64toImage(base64Image);
        const newImage = new ImageModel({ prompt, imageUrl });
        await newImage.save();

        return res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Error generating image:", error);
        return res.status(500).json({ error: "Failed to generate image" });
    }
};

const getImage = async (req, res) => {
    try {
        let page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;

        page = Math.max(page, 1);
        limit = Math.max(limit, 1);

        const totalImages = await ImageModel.countDocuments();
        if (totalImages === 0) {
            return res.status(200).json({
                images: [],
                totalPages: 0,
                currentPage: page,
            });
        }

        const images = await ImageModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-__v");

        return res.status(200).json({
            images,
            totalPages: Math.ceil(totalImages / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { generateImage, getImage };
