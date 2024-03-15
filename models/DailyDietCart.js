const mongoose = require("mongoose");
const { Decimal128 } = mongoose.Schema.Types;
 
const DailyDietCart = mongoose.Schema(
    {
        user: { type: String },
        name: {type : String},
        foodItem: [],
        totalCalorie: { type: Number, default: 0 },
        protine: { type: Decimal128, default: 0.0 },
        carbohydrates: { type: Decimal128, default: 0.0 },
        fats: { type: Decimal128, default: 0.0 }
    }
)

module.exports = mongoose.model('DailyDietCart', DailyDietCart);

