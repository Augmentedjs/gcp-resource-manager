const PluginFactory = Core.PluginFactory,
      Plugin = Core.Plugin;

describe("Given plugin architecture", () => {
  let p;

  describe("can create a plugin", () => {
    beforeEach((done) => {
      p = new Plugin();
      done();
    });

    afterEach((done) => {
      p = null;
      done();
    });

    it("can init the plugin", () => {
      expect(p).to.not.be.undefined;
    });
  });
});