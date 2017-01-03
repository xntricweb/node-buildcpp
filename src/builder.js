
class Builder {
  constructor(o) {
    this.buildData = o;
  }

  build(target) {
    return new Promise(res, rej) {
      if (!this._build) {
        let err = new Error("Build is currently not supported on this platform.");
        err.target = target;
        rej(err);
      }
    }
  }

  clean() {
    if (!this._clean) {
      let err = new Error("Clean is currently not supported on this platform.");
      err.target = target;
      rej(err);
    }
  }
}
