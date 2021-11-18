import { Strategy } from "@augmentedjs/resource-manager";

/**
 * Google Cloud Storage Resource Manager Strategy
 * @extends Strategy
 */
class GCPStrategy extends Strategy {
  constructor(options = {}) {
    super(options);
    /**
     * @name bucket
     * @property {object} bucket GCP Storage Bucket
     */
    this.bucket = (options.bucket) ? options.bucket : null;
  };

  /**
   * Read a file from storage
   * @param {string} path path or filename
   * @returns {string} Returns file contents
   * @async
   */
  read(path) {
    return new Promise((resolve, reject) => {
      if (path && this.bucket) {
        // console.debug("read", path);
        const stream = this.createReadStream(path);
        // console.log('Concat Data');
        let buf = "";
        stream
        .on("data", (d) => {
          buf += d;
        })
        .on("end", () => {
          // console.debug("buf", buf);
          // console.log("End");
          resolve(buf);
        })
        .on("error", (err) => {
          console.error(err);
          reject(err);
        });
      } else {
        reject("Nothing");
      }
    })
    .catch((e) => {
      console.error(e);
      throw new Error(e);
    });
  };

  /**
   * Write a file to storage
   * @param {string} path path or filename
   * @param {any} data Data to write
   * @param {boolean} p make public
   * @returns {string} path or filename
   * @async
   */
  write(path, data, p = false) {
    return new Promise((resolve, reject) =>{ 
      if (path && data && this.bucket) {
        const file = this.bucket.file(path);
        if (file) {
          resolve(file);
        } else {
          reject("No File!");
        }
      } else {
        reject("No path or bucket!");
      }
    })
    .then((file) => {
      return file.save(data, (err) => {
        if (!err) {
          // File written successfully.
          if (p) {
            file.makePublic();
          }
          return path;
        } else {
          throw new Error(`Write failed: ${(err && err.errors && err.errors[0] && err.errors[0].message ? err.errors[0].message : "")}`);
        }
      });
    })
    .then((path) => {
      // console.debug(path);
      return path;
    })
    .catch((e) => {
      console.error(e);
      throw new Error(e);
    });
  };

  /**
   * Checks if a file exists on storage
   * @param {string} path path or filename
   * @returns {boolean} Returns true if exists
   * @async
   */
  exists(path) {
    return new Promise((resolve, reject) => {
      if (path && this.bucket) {
        const file = this.bucket.file(path);
        file.exists((err, exists) => {
          if (!err) {
            resolve(exists);
          } else {
            console.error(err);
            reject(err);
          }
        });
      } else {
        reject("no path or bucket!");
      }
    });
  };

  /**
   * Creates a read stream
   * @param {string} path path or filename
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
   * @param {string} path path or filename (optional to filter a path prefix)
   * @returns {array} Returns an array of files
   * @async
   */
   async readAll(path) {
    try {
      if (this.bucket) {
        const options = (path) ? { "prefix": path } : null;
        // console.debug("reading", path, options);
        const files = await this.bucket.getFiles(options);
        return files;
      } else {
        throw new Error("No bucket!");
      }
    } catch(e) {
      throw e;
    }
  };
};

export default GCPStrategy;