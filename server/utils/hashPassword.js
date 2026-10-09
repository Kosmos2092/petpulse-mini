const crypto = require("crypto");

// Пароль храним не в открытом виде, а в виде хеша.
// При входе хешируем введённый пароль и сравниваем хеши.
const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

module.exports = hashPassword;
