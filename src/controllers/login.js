const jwt = require("jsonwebtoken");
const { login } = require('../models/db');
const secretKey = process.env["SECRET_KEY"];
//generar token por usuario haciendo login 2minutos

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await login(email, password);

    if (user) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 120,
          data: user,
        },
        secretKey
      );
      return res.json({ token })
    }
    return res.json({ message:'Usuario o contraseña incorrecta' })
}

module.exports = {
    loginUser
}

