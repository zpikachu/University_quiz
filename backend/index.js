import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// ----------------- MongoDB Connection -----------------
mongoose
  .connect(process.env.MONGO_URI )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------- Quiz Schema -----------------
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  quizFile: { type: Array, required: true }, // array of { question, options, answer }
});

const Quiz = mongoose.model("Quiz", quizSchema);

// ----------------- Admin API -----------------

// ➕ Add new quiz
app.post("/api/admin/quizzes", async (req, res) => {
  try {
    const { title, quizFile } = req.body;
    if (!title || !quizFile) return res.status(400).send("Missing title or quiz JSON");

    const quiz = new Quiz({ title, quizFile });
    await quiz.save();

    res.json({ message: "Quiz added successfully", quiz: { title } });
  } catch (err) {
    if (err.code === 11000) return res.status(400).send("Quiz title exists");
    res.status(500).send("Error adding quiz");
  }
});

// ❌ Delete quiz
app.delete("/api/admin/quizzes/:title", async (req, res) => {
  try {
    const result = await Quiz.findOneAndDelete({ title: req.params.title });
    if (!result) return res.status(404).send("Quiz not found");
    res.json({ message: "Quiz deleted successfully" });
  } catch {
    res.status(500).send("Error deleting quiz");
  }
});

// ✏️ Edit quiz
app.put("/api/admin/quizzes/:title", async (req, res) => {
  try {
    const { title, quizFile } = req.body;
    const updated = await Quiz.findOneAndUpdate(
      { title: req.params.title },
      { $set: { title, quizFile } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).send("Quiz not found");
    res.json({ message: "Quiz updated successfully", quiz: updated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).send("New title already exists");
    res.status(500).send("Error updating quiz");
  }
});

// ----------------- User API -----------------

// 📃 Get all quizzes
app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, "title");
    res.json(quizzes);
  } catch {
    res.status(500).send("Error fetching quizzes");
  }
});

// ❓ Get quiz questions by title
app.get("/api/quizzes/:title", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ title: req.params.title });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz.quizFile);
  } catch {
    res.status(500).send("Error fetching quiz");
  }
});


const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

const Admin = mongoose.model("Admin", adminSchema);

// ----------------- CREATE DEFAULT ADMIN -----------------
async function createDefaultAdmin() {
  const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (!existing) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ username: process.env.ADMIN_USERNAME, passwordHash });
    console.log("✅ Default admin created");
  }
}
createDefaultAdmin();

// ----------------- LOGIN -----------------
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing username or password");

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).send("Invalid credentials");

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return res.status(401).send("Invalid credentials");

  res.json({ message: "Login successful" });
});

// ----------------- Start server -----------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
