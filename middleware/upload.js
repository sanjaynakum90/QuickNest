import multer from "multer";
import cloudinary from "../config/cloudinary.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "quickNest",
//     format: "webp",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//     transformation: [
//       { width: 1000, height: 1000, crop: "limit" },
//       {
//         quality: "auto",
//       },
//       {
//         fetch_format: "auto",
//       },
//     ],
//   },
// });

// const uploads = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// export default uploads;



const createUpload = ({
  folder,
  formats,
  mimeTypes = [],
  transformation,
  fileSize = 5 * 1024 * 1024,
  resource_type = "auto",
}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: formats,
      public_id: `${file.fieldname + "-" + Date.now() + path.extname(file.originalname)}`,
      transformation,
    },
  });

  return multer({
    storage,
    limits: { fileSize },
    fileFilter: (req, res, cb) => {
      if (mimeTypes.length === 0 || mimeTypes.includes(file.mimeTypes)) {
        cb(null, true)
      } else {
        cb(
          new Error(
            `file format is not valid please select from these files format ${mimeTypes.join(",").split(" ")}`,
            false,
          ),
        );
      }
    },
  });
};


export const uploadFile = createUpload({
  folder: "quicknest/profilePicture",
  formats: ["jpg", "jpeg", "png"],
  mimeTypes: ["image/jpg", "image/png", "image/jpeg"],
  fileSize: 2 * 1024 * 1024,
  resource_type: "image",
  transformation: [
    {
      height: 500,
      width: 500,
      crop: "fill",
      gravity: "face",
      quality: "auto",
      fetch_format: "auto"
    }
  ]
});


export const uploadDocument = createUpload({
  folder: "quicknext/Documents",
  formats: ["jpg", "png", "jpeg", "pdf"],
  mimeTypes: ["image/jpg", "image/png", "image/jpeg", "applicatio/pdf"],
  fileSize: 15 * 1024 * 1024,
  transformation: [{ quality: "auto", fetch_format: "auto" }]
})
