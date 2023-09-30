import express from "express";
import { User } from "../../models/user";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  // check if user exists
  const user = await User.find({ email });

  if (user.length > 0) {
    res.status(400).json({ message: "user already exists" });
  } else {
    const newUser = new User({
      email,
      password,
      name,
    });
    await newUser.save();
    res.status(200).json({ message: "user created" });
  }
});
