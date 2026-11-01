import mongoose from "mongoose";

export const connectDatabase = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("La variable de entorno MONGO_URL es obligatoria");
  }

  await mongoose.connect(process.env.MONGO_URL);
  console.log("Conexión a MongoDB establecida");
};