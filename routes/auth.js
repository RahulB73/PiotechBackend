const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    verifyToken,
} = require("./varifyToken");

// Login
router.post('/login', async (req, res) => {
    try {
        
        const user = await User.findOne(
            {
                email: req.body.email
            }
        );

        if (!user) {
            return res.status(401).json("Wrong email Name");
        }

         
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;

        if (!bcrypt.compare(inputPassword, originalPassword)) {
            return res.status(401).json("Wrong Password");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "5d" }
        );
 
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (err) {
        res.status(500).json(err);
    }
});



router.post("/check-token", (req, res) => {
    console.log(req.headers.token)
    res.status(200).json("Token is valid!");
});

module.exports = router;
