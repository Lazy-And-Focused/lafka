import mongoose from "mongoose";

import "./schemas/index";
import ".";
import "./model";

export default async (url: string) => {
  mongoose
    .connect(url)
    .catch((err) => console.error(err))
    .then(async () => {
      console.log("Connected to MongoDB");
    });
};
