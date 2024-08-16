import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: { type: String },
  score: { type: Number, default: 0 },
});

export default mongoose.model("Score", ScoreSchema);
