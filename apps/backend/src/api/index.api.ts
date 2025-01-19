import { config } from "dotenv";

config();

class Api {
    public readonly env = process.env;
}

export default Api;