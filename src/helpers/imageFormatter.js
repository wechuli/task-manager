const sharp = require("sharp");

module.exports = {

  //Since you are using an async function remember to use await wherever yo call the fucntion
  async formatAvatarPhoto(buffer) {
    const newBuffer = await sharp(buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    return newBuffer;
  }
};
