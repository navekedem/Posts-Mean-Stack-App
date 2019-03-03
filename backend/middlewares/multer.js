const multer = require('multer');

const MIME_Type_Map = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',

};


const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const isValid = MIME_Type_Map[file.mimetype];
    let error = new Error('Inavlid Mime Type');
    if(isValid){
      error = null;
    }
    cb(error,"backend/images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_Type_Map[file.mimetype];
    cb(null, name+"-"+ Date.now() + "." + ext);
  }
});
module.exports = multer({storage: storage}).single('image');
