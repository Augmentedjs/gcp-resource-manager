const GCPStrategy = Core.GCPStrategy;

describe("Given a GCP Strategy", () => {
  let s;

  describe("can create an instance", () => {
    beforeEach((done) => {
      s = new GCPStrategy({ "bucket": bucket });
      done();
    });

    afterEach((done) => {
      s = null;
      done();
    });

    it("can init", () => {
      expect(s).to.not.be.undefined;
      expect(s.bucket).to.not.be.undefined;
    });

    it("can write a file to gcp", async () => {
      const ret = await s.write("temp-junk-file.txt", "This is a test file, it can be deleted.");
      console.debug("ret", ret);
      expect(ret).to.not.be.undefined;
      expect(ret).to.not.equal(null);
    });

    xit("can write a file then read it back from gcp", async () => {
      let ret = await s.write("temp-junk-file.txt", "This is a test file, it can be deleted.");
      ret = await s.read("temp-junk-file.txt");
      
      console.debug("ret", ret);
      expect(ret).to.not.be.undefined;
      expect(ret).to.not.equal(null);
    });
  });
});