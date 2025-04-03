import GeneralStrategy from "./general.stategy";

class Passport extends GeneralStrategy {
  public constructor() {
    super();

    this.auth.init();
  }
}

export default Passport;
