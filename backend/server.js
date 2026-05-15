require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const Project = require("./models/Project");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log(error);
    });

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

/* GET ALL PROJECTS */
app.get("/api/projects", async (req, res) => {

    try {

        const projects =
            await Project.find().sort({ createdAt: -1 });

        res.json(projects);

    } catch (error) {

        res.status(500).json({
            message: "Failed to get projects",
            error: error.message
        });
    }
});

/* ADD PROJECT */
app.post("/api/projects", async (req, res) => {

    try {

        const newProject =
            await Project.create({

                title: req.body.title,
                category: req.body.category,
                description: req.body.description,
                image: req.body.image,
                github: req.body.github,
                demo: req.body.demo
            });

        res.status(201).json(newProject);

    } catch (error) {

        res.status(400).json({
            message: "Failed to add project",
            error: error.message
        });
    }
});

/* UPDATE PROJECT */
app.put("/api/projects/:id", async (req, res) => {

    try {

        const updatedProject =
            await Project.findByIdAndUpdate(

                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedProject) {

            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json(updatedProject);

    } catch (error) {

        res.status(400).json({
            message: "Failed to update project",
            error: error.message
        });
    }
});

/* DELETE PROJECT */
app.delete("/api/projects/:id", async (req, res) => {

    try {

        const deletedProject =
            await Project.findByIdAndDelete(req.params.id);

        if (!deletedProject) {

            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
});

app.listen(5050, () => {
    console.log("Server running on http://localhost:5050");
});