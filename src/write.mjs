const formatDate = require("../../utility/formatDate.js");

import { Storage } from "@google-cloud/storage";
const storage = new Storage({
  projectId: process.env.CLOUD_PROJECT
});
const bucket = storage.bucket(process.env.CLOUD_BUCKET);

const sendToGCS = (path) => {
  let cloudStorageError = null,
      cloudStorageObject = null;
  //console.debug("sendUploadToGCS");
  if (!path) {
    const msg = "No files were uploaded.  Must be a formdata post with 'image' as the key.";
    console.error(msg);
    cloudStorageError = msg;
  } else {
    const gcsname = Date.now() + path;
    //Logger.debug("creating cloud file:", gcsname);
    const file = bucket.file(gcsname);
    const stream = file.createWriteStream({
      metadata: {
        contentType: uimage.mimetype // TODO: look into this
      },
      resumable: false
    });

    stream.on("error", (err) => {
      cloudStorageError = err;
      Logger.error("Error with cloud", err);
      return res.status(500).send({ "error": err, "status": 500 });
    });

    stream.on("finish", () => {
      cloudStorageObject = gcsname;
      //Logger.debug("gcsname", gcsname);
      file.makePublic().then(() => {
        cloudStoragePublicUrl = `${process.env.GOOGLE_CLOUD_STORAGE_URI}${process.env.CLOUD_BUCKET}/${gcsname}`;
        next();
      });
    });

    stream.end(uimage.data);
  }
  
  return { "object": cloudStorageObject, "error": cloudStorageError };
};

module.exports = sendGCS;
