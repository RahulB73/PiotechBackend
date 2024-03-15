const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const requestRoute = require("./routes/request");
const foodRoute = require("./routes/food");
const calorieCartRoute = require("./routes/dietCart");
const cors = require("cors");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("DB Connection Successesful"))
    .catch((err) => {
        console.log(err);
    })

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/request", requestRoute);
app.use("/api/food", foodRoute);
app.use("/api/calorieCart", calorieCartRoute);

app.listen(process.env.PORT || 5050, () => {
    console.log("Backend Server is Running");
})