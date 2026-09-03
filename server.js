const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ================= Middleware =================

app.use(cors());
app.use(express.json());

// ================= MongoDB Connection =================

mongoose.connect("mongodb://127.0.0.1:27017/ComplaintDB")
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

// ================= User Schema =================

const User = mongoose.model("User", {

    name: String,
    email: String,
    phone: String,
    password: String

});

// ================= Complaint Schema =================

const Complaint = mongoose.model("Complaint", {

    userEmail: String,

    title: String,

    department: String,

    description: String,

    status: {
        type: String,
        default: "Pending"
    },

    date: {
        type: Date,
        default: Date.now
    }

});

// ================= Home =================

app.get("/", (req, res) => {

    res.send("Blockchain Complaint Management System Running");

});

// ================= Register =================

app.post("/register", async (req, res) => {

    try {

        const user = new User(req.body);

        await user.save();

        res.send("Registration Successful");

    } catch (err) {

        console.log(err);

        res.status(500).send("Registration Failed");

    }

});

// ================= Login =================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({

            email: email,
            password: password

        });

        if (user) {

            res.send("Login Successful");

        } else {

            res.send("Invalid Email or Password");

        }

    } catch (err) {

        console.log(err);

        res.status(500).send("Login Failed");

    }

});

// ================= Submit Complaint =================

app.post("/complaint", async (req, res) => {

    try {

        const complaint = new Complaint({

            userEmail: req.body.userEmail,

            title: req.body.title,

            department: req.body.department,

            description: req.body.description

        });

        await complaint.save();

        res.send("Complaint Submitted Successfully");

    } catch (err) {

        console.log(err);

        res.status(500).send("Complaint Submission Failed");

    }

});

// ================= Get All Complaints =================

app.get("/complaints", async (req, res) => {

    try {

        const complaints = await Complaint.find().sort({ date: -1 });

        res.json(complaints);

    } catch (err) {

        console.log(err);

        res.status(500).send("Failed to Load Complaints");

    }

});

// ================= Get User Complaints =================

app.get("/complaints/:email", async (req, res) => {

    try {

        const complaints = await Complaint.find({

            userEmail: req.params.email

        }).sort({ date: -1 });

        res.json(complaints);

    } catch (err) {

        console.log(err);

        res.status(500).send("Failed to Load User Complaints");

    }

});

// ================= Update Complaint Status =================

app.put("/complaint/:id", async (req, res) => {

    try {

        const updatedComplaint = await Complaint.findByIdAndUpdate(

            req.params.id,

            {
                status: req.body.status
            },

            {
                new: true
            }

        );

        if (!updatedComplaint) {

            return res.status(404).send("Complaint Not Found");

        }

        res.send("Complaint Status Updated");

    } catch (err) {

        console.log(err);

        res.status(500).send("Failed to Update Status");

    }

});

// ================= Delete Complaint =================

app.delete("/complaint/:id", async (req, res) => {

    try {

        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

        if (!deletedComplaint) {

            return res.status(404).send("Complaint Not Found");

        }

        res.send("Complaint Deleted Successfully");

    } catch (err) {

        console.log(err);

        res.status(500).send("Failed to Delete Complaint");

    }

});

// ================= Server =================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});