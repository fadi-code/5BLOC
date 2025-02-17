const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

async function uploadToIPFS(fileBuffer) {
    const formData = new FormData();
    formData.append("file", fileBuffer);

    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY
        }
    });

    console.log("File uploaded:", response.data);
}

module.exports = uploadToIPFS;
