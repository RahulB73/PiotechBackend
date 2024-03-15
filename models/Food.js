const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
    {
        foodname: { type: String },
        calorie: { type: Number },
        carbohydrates: { type: Number },
        protien: { type: Number },
        fats: { type: Number },
        img: { type: String }

    },
    { timestamps: true }

)

module.exports = mongoose.model("Food", FoodSchema);