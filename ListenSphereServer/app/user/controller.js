import { User } from "../../models/user.js";

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const saveUser = async (req, res) => {
    const user = new User({
        name: req.body.name,
        socials: req.body.socials,
        bio: req.body.bio,
    });
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.json({ message: error.message });
    }
};
