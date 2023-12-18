const express = require("express");
const router = express.Router();
const multer = require('multer')
const path = require('path')
const pool = require("./config/config2.js")

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "/upload")) // dirname itu pwd command
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

router.use("/upload", express.static(path.join(__dirname, "upload"))) // Reference untuk soal terakhir

// ini untuk upload gambar ke dalam database
router.post("/upload/:id/image",
            multer({ storage: diskStorage }).single('image'),
            (req, res) => {
                const file = req.file.path
                const {id} = req.params

                if(!file) {
                    res.status(400).json({message: "No file uploaded"})
                } else {
                    const query = `
                    UPDATE games 
                    SET image_url = $1
                    WHERE id = $2
                    `

                    const imageUrl = `http://localhost:3000/upload/${req.file.filename}`

                    pool.query(query, [imageUrl, id], (err, result) => {
                        if(err) {
                            res.status(500).json({message: err.message})
                        } else {
                            res.status(200).json({message: "Image uploaded"})
                        }
                    })

                }
            }
)

module.exports = router;
  