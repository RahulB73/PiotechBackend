const router = require("express").Router();
const DailyDietCart = require("../models/DailyDietCart");
const mongoose = require("mongoose");
const Food = require("../models/Food");


// Creating a DailyDietCart
router.post("/create", async (req, res) => {
    const newDailyDietCart = new DailyDietCart(req.body);

    try {
        const foodItems = await Food.find({
            _id: { $in: newDailyDietCart.foodItem }
        });

        // if (!foodItems.length) {
        //     res.status(400).json({ message: "No food items found with provided IDs" });
        //     return;
        // }

        let totalCalories = 0;
        let totalProtine = 0;
        let totalCarbohydrates = 0;
        let totalFats = 0;

        foodItems.forEach(food => {
            console.log(food);
            totalCalories += food.calorie;
            totalProtine += food.protien;
            totalCarbohydrates += food.carbohydrates;
            totalFats += food.fats;
        });

        newDailyDietCart.protine = totalProtine;
        newDailyDietCart.carbohydrates = totalCarbohydrates;
        newDailyDietCart.fats = totalFats;
        newDailyDietCart.totalCalorie = totalCalories;

        const saveDailyDietCart = await newDailyDietCart.save();
        res.status(200).json(saveDailyDietCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating daily diet cart" });
    }
});



// GET DAILY DIET CART BY USER ID
router.get("/find/:userid", async (req, res) => {
    try {
        const cart = await DailyDietCart.findOne({ user: req.params.userid });
        if (!cart) {
            return res.status(404).json({ message: "Cart Not Exist" });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: "Error finding cart" });
    }
});



// Add the food item from the daily diet cart
router.post("/addFoodItem/:cartId", async (req, res) => {
    const { foodItemId } = req.body;
    const { cartId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: "Invalid cartId format" });
    }

    try {
        // Retrieve the food item to be added
        const foodItemToAdd = await Food.findById(foodItemId);

        if (!foodItemToAdd) {
            res.status(404).json({ message: "Food item not found" });
            return;
        }

        const updatedCart = await DailyDietCart.findByIdAndUpdate(
            cartId,
            {
                $push: {
                    foodItem: foodItemId
                },
                $inc: {
                    totalCalorie: Number(foodItemToAdd.calorie.toFixed(1)),
                    protine: Number(foodItemToAdd.protien.toFixed(1)),
                    carbohydrates: Number(foodItemToAdd.carbohydrates.toFixed(1)),
                    fats: Number(foodItemToAdd.fats.toFixed(1))
                }
            },
            { new: true }
        );

        if (!updatedCart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        res.status(200).json(updatedCart);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding food item to cart" });
    }
});



// Remove the food item from the daily diet cart
function roundToDecimal(value, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
}

router.post("/removeFoodItem/:cartId", async (req, res) => {
    const { foodItemId } = req.body;

    try {
        const foodItemToRemove = await Food.findById(foodItemId);

        if (!foodItemToRemove) {
            return res.status(404).json({ message: "Food item not found" });
        }

        const cart = await DailyDietCart.findById(req.params.cartId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const foodItemIndex = cart.foodItem.indexOf(foodItemId);

        if (foodItemIndex !== -1) {
            cart.foodItem.splice(foodItemIndex, 1);

            // Update total calorie and other values with rounded values
            cart.totalCalorie = roundToDecimal(cart.totalCalorie - foodItemToRemove.calorie, 2);
            cart.protine = roundToDecimal(cart.protine - foodItemToRemove.protien, 2);
            cart.carbohydrates = roundToDecimal(cart.carbohydrates - foodItemToRemove.carbohydrates, 2);
            cart.fats = roundToDecimal(cart.fats - foodItemToRemove.fats, 2);

            // Save the updated values to the database
            await cart.save();

            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Food item not found in cart" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error removing food item from cart" });
    }
});






module.exports = router;