const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
    {
        name : { type: String, required: true},
        email : { type: String, required: true},
        request: { type: String, required: true },
        approval: { type: String, default: "Pending"},
        isNuetrician : {
            type: Boolean,
            default: false,
          },
    },
    { timestamps: true }

)

module.exports = mongoose.model("Request", RequestSchema);