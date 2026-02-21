import cloudinary from "../../utils/cloudinary.js"

export const uploadImage = async (req, res) => {
    try {
        cloudinary.uploader.upload(req.file.path, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading to Cloudinary"
                })
            }

            res.status(200).json({
                success: true,
                message: "Uploaded!",
                data: result
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

