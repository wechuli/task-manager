const multer = require("multer");

const upload = multer({
  dest: "avatars",
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith(".pdf")) {
    //   return cb(new Error("Please upload a pdf"));
    // }

    // if (!file.originalname.match(/\.(doc|docx)$/)) {
    //   return cb(new Error("Please upload a word document"));
    // }
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
      return cb(
        new Error("File format not allowed, allowed formats: jpg,jpeg,png,svg")
      );
    }

    cb(undefined, true);
    // cb(new Error(""));
    // cb(undefined, true);
  }
});

module.exports = upload;
