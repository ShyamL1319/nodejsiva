const multer = require("multer");
const logger = require("../config/winston");

const csvFilter = async (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
    logger.info("Wrong format file uploaded")
  }
};
var storage =  multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-leads-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
module.exports = uploadFile;