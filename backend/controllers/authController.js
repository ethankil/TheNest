const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Temporary in-memory "DB"
let users = [];

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const userExists = users.find(user => user.email === email);
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  const token = jwt.sign({ email }, "secretkey", { expiresIn: "1h" });

  res.status(201).json({ message: "User created", token });
};
