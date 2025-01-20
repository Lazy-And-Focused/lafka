import mongoose from "mongoose";
import "./models.database";

mongoose
	.connect("mongodb://127.0.0.1/lafka")
	.catch((err) => console.error(err))
	.then(async () => {
		console.log("Подключен к базе данных");
	});
