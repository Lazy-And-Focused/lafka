import mongoose from "mongoose";
import "./models.database";

export default async (url = "mongodb+srv://laf:jIDOPKEVOsTTP81k@lafka.y12tx.mongodb.net/?retryWrites=true&w=majority&appName=lafka") => {
	mongoose
		.connect(url)
		.catch((err) => console.error(err))
		.then(async () => {
			console.log("Connected to MongoDB");
		});
};
