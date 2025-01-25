import mongoose from "mongoose";
import "./models.database";

export default async (url = "mongodb://127.0.0.1/lafka") => {
	mongoose
		.connect(url)
		.catch((err) => console.error(err))
		.then(async () => {
			console.log("Подключен к базе данных");
		});
};
