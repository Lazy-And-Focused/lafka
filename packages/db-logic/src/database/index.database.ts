import mongoose from "mongoose";
import "./models.database";

import connect from "lafka/redis/index";
import Redis from "lafka/redis/modesl.database";
import Models from "./models.database";

export default async (url = "mongodb://127.0.0.1/lafka", redis?: string) => {
	mongoose
		.connect(url)
		.catch((err) => console.error(err))
		.then(async () => {
			if (redis) new Models(new Redis(await connect(redis)));

			console.log("Connected to MongoDB");
		});
};
