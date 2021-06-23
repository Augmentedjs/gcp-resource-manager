global.Core = require("../temp/gcp-resource-manager.js");

const chai = require("chai");
global.chai = chai;
global.expect = chai.expect;

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.CLOUD_PROJECT
}),
bucket = storage.bucket(process.env.CLOUD_BUCKET);

global.bucket = bucket;