const Request = require("../models/Request");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./varifyToken");
const CryptoJS = require("crypto-js");


// Create Request
router.post("/createRequest", verifyTokenAndAuthorization, async (req, res) => {
  const newRequest = new Request(req.body);
  console.log(newRequest)
  try {
    const savedRequest = await newRequest.save();
    res.status(200).json(savedRequest);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});


// Get All Request
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await Request.find().sort({ _id: -1 }).limit(5)
      : await Request.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;