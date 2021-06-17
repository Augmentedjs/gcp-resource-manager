import { Strategy } from "@augmentedjs/resource-manager";

/**
 * Google Cloud Storage Resource Manager Strategy
 * @extends Strategy
 */
class GCPResourceManager extends Strategy {
  constructor(options = {}) {
    super(options);
    /**
     * @property {object} GCP Storage Bucket
     */
    this.bucket = (options.bucket) ? options.bucket : null;
  };

  /**
   * Read a file from storage
   * @param path {string} path or filename
   * @returns {string} Returns file contents
   */
  read(path) {
    if (path) {
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
      } catch (err) {
        console.error(err);
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
    if (path && data) {
      try {
        const file = this_bucket.file(path);
        file.save(data, (err) => {
          if (!err) {
            // File written successfully.
            return path;
          }
          console.error(err);
        });
        // console.debug("write", path);
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  };

  /**
   * Checks if a file exists on storage
   * @param path {string} path or filename
   * @returns {boolean} Returns true if exists
   */
  exists(path) {
    if (path) {
      try {
        const file = this_bucket.file(path);
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
    if (path) {
      const file = this_bucket.file(path);
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
    if (path) {
      const [files] = this_bucket.getFiles();
      return files;
    }
    return null;
  };
};

export default GCPResourceManager;