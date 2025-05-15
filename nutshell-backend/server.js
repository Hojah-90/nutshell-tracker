const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Subject Schema
const subjectSchema = new mongoose.Schema({
    name: String,
    lessons: [{ id: Number, name: String, completed: Boolean }],
});
const Subject = mongoose.model("Subject", subjectSchema);

// Progress Schema
const progressSchema = new mongoose.Schema({
    subjectId: mongoose.Schema.Types.ObjectId,
    date: String,
    completed: Boolean,
});
const Progress = mongoose.model("Progress", progressSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Explicitly set to ObjectId
    date: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", taskSchema);

// API Routes
app.get("/api/subjects", async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch subjects", details: err.message });
    }
});

app.post("/api/subjects", async (req, res) => {
    try {
        const newSubject = new Subject(req.body);
        await newSubject.save();
        res.json(newSubject);
    } catch (err) {
        res.status(500).json({ error: "Failed to create subject", details: err.message });
    }
});

app.put("/api/subjects/:id", async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubject) return res.status(404).json({ error: "Subject not found" });
        res.json(updatedSubject);
    } catch (err) {
        res.status(500).json({ error: "Failed to update subject", details: err.message });
    }
});

app.delete("/api/subjects/:id", async (req, res) => {
    try {
        const result = await Subject.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: "Subject not found" });
        res.json({ message: "Subject deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete subject", details: err.message });
    }
});

app.get("/api/progress", async (req, res) => {
    try {
        const progress = await Progress.find();
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch progress", details: err.message });
    }
});

app.post("/api/progress", async (req, res) => {
    try {
        const newProgress = new Progress(req.body);
        await newProgress.save();
        res.json(newProgress);
    } catch (err) {
        res.status(500).json({ error: "Failed to create progress", details: err.message });
    }
});

app.put("/api/progress/:id", async (req, res) => {
    try {
        const updatedProgress = await Progress.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProgress) return res.status(404).json({ error: "Progress not found" });
        res.json(updatedProgress);
    } catch (err) {
        res.status(500).json({ error: "Failed to update progress", details: err.message });
    }
});

app.delete("/api/progress/:id", async (req, res) => {
    try {
        const result = await Progress.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: "Progress not found" });
        res.json({ message: "Progress entry deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete progress", details: err.message });
    }
});

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: "Failed to fetch tasks", details: err.message });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        if (!req.body.description || !req.body.subjectId || !req.body.date) {
            return res.status(400).json({ error: "Description, subjectId, and date are required" });
        }
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to create task", details: err.message });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ error: "Task not found" });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task", details: err.message });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task", details: err.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));