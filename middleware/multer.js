import multer from 'multer'
const path = '/home/radeonares/Project/Jobs/projenerasyon/projenerasyon/public/admin/uploads'
export const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path)
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.originalname}.${ext}`);
    },
});

export const upload = multer({ storage: multerStorage })
