// import multer from 'multer'

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })


// function fileFilter (req, file, cb) {
//    const allowedFiles = ['image/png','image/jpg','image/jpeg','image/webp']
//    if(!allowedFiles.includes(file.mimetype)){
//         cb(new Error('Only images are allowed.',false))
//    }else{
//       cb(null, true)
//   }


// }

// const upload = multer({ storage: storage,fileFilter:fileFilter() })
// export default upload


import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.join(process.cwd(), 'uploads')

// ensure uploads dir exists (minimal defensive change)
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
} catch (err) {
  // if mkdir fails, let multer still try and surface error later
  console.error('Could not ensure upload directory exists:', err.message)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

function fileFilter(req, file, cb) {
  const allowedFiles = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

  // fixed: use includes (not include)
  if (!allowedFiles.includes(file.mimetype)) {
    return cb(new Error('Only images are allowed'), false)
  }

  cb(null, true)
}

const upload = multer({ storage, fileFilter })

export default upload