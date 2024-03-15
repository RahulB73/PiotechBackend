const router = require("express").Router();
const Food = require("../models/Food");

// Creating Food Item
router.post("/create", async (req, res) => {
    const newFood = new Food(req.body);
    console.log(newFood)
    try {
        const savedFood = await newFood.save();
        res.status(200).json(savedFood);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// GET Food Item By Name
router.get("/find/:foodname", async (req, res) => {
    try {
        const food = await Food.findOne({ foodname: req.params.foodname });
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        res.status(200).json(food);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error finding food" });
    }
});

// Get all Food Items
router.get("/", async (req, res) => {
    const { new: isNew } = req.query;
    try {
        let allFood;

        if (isNew) {
            allFood = await Food.find().sort({ _id: -1 }).limit(5);
        } else {
            allFood = await Food.find();
        }

        res.status(200).json(allFood);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Food Item By Id
router.get("/findById/:id", async (req, res) => {
    try {
        console.log("Started");
        console.log(req);
        const userCart = await Food.find({ _id: { $in: req.params.id } });
        res.status(200).json(userCart);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;