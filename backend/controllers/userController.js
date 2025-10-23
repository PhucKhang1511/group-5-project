let users = [
  { id: 1, name: "Nghị Phúc Khang", email: "khang@example.com" },
  { id: 2, name: "Lê Công Biên", email: "bien@example.com" },
  { id: 3, name: "Nguyễn Võ Hoàng Diệp", email: "diep@example.com" },
];

exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

exports.addUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
