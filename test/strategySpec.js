const GCPResourceManager = Core.GCPResourceManager;

describe("Given a GCP Strategy", () => {
  let p;

  describe("can create an instance", () => {
    beforeEach((done) => {
      s = new GCPResourceManager();
      done();
    });

    afterEach((done) => {
      s = null;
      done();
    });

    it("can init", () => {
      expect(s).to.not.be.undefined;
    });
  });
});