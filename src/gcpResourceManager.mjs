import { Strategy } from "@augmentedjs/resource-manager";

/**
 * Google Cloud Storage Resource Manager Strategy
 * @extends Strategy
 */
class GCPStrategy extends Strategy {
  constructor(options = {}) {
    super(options);
    /**
     * @property {object} bucket GCP Storage Bucket
     */
    this.bucket = (options.bucket) ? options.bucket : null;
  };

  /**
   * Read a file from storage
   * @param path {string} path or filename
   * @returns {string} Returns file contents
   */
  read(path) {
    if (path && this.bucket) {
      try {
        // console.debug("read", path);
        const stream = this.createReadStream(path);
        // console.log('Concat Data');
        let buf = "";
        stream.on("data", (d) => {
          buf += d;
        }).on("end", () => {
          // console.log(buf);
          // console.log("End");
          return buf;
        })
        .on("error", (err) => {
          console.error(err);
        });
        return buf;
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    }
    return null;
  };

  /**
   * Write a file to storage
   * @param path {string} path or filename
   * @param data {any} Data to write
   * @returns {string} path or filename
   */
  write(path, data) {
    if (path && data && this.bucket) {
      return new Promise((resolve, reject) =>{ 
        const file = this.bucket.file(path);
        if (file) {
          resolve(file);
        } else {
          reject("No File!")
        }
      })
      .then(async (file) => {
        const ret = await file.save(data);
        if (ret) {
          file.makePublic();
          return path;
        } else {
          throw new Error("Write failed");
        }
      })
      .then((path) => {
        // console.debug(path);
        return path;
      })
      .catch((e) => {
        console.error(e);
        throw new Error(e);
      });
    }
    return null;
  };

  /**
   * Checks if a file exists on storage
   * @param path {string} path or filename
   * @returns {boolean} Returns true if exists
   */
  exists(path) {
    if (path && this.bucket) {
      try {
        const file = this.bucket.file(path);
        file.exists((err, exists) => {
          if (!err) {
            return exists;
          }
          console.error(err);
        });
      } catch (err) {
      }
    }
    return false;
  };

  /**
   * Creates a read stream
   * @param path {string} path or filename
   * @returns {ReadStreamHandle} Returns a read stream handle
   */
  createReadStream(path) {
    if (path && this.bucket) {
      const file = this.bucket.file(path);
      if (file) {
        return file.createReadStream(path);
      }
    }
    return null;
  };

  /**
   * Reads the contents on a 'directory' in storage
   * @param path {string} path or filename
   * @returns {array} Returns an array of files
   */
  readAll(path) {
    if (path && this.bucket) {
      const [files] = this.bucket.getFiles();
      return files;
    }
    return null;
  };
};

export default GCPStrategy;