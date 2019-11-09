const express = require("express");

const router = express.Router();

const UserDb = require("./userDb");
const PostDb = require("../posts/postDb");

router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await UserDb.insert(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error creating new user" });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  try {
    const newPost = await PostDb.insert({
      user_id: req.params.id,
      ...req.body
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status({ message: "internal server error adding new post" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await UserDb.get();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error fetching users" });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await UserDb.getUserPosts(req.params.id);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error fetching user's posts" });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    await UserDb.remove(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error deleting user" });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    const updatedUser = await UserDb.update(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error updating user" });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const user = await UserDb.getById(req.params.id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch (error) {
    res.status(500).json({ message: "error validating user id" });
  }
}

function validateUser(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
