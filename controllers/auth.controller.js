const adminUser = {
  username: 'admin',
  password: 'admin123'
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (username === adminUser.username && password === adminUser.password) {
    req.session.user = username;
    res.json({ message: 'Login berhasil!' });
  } else {
    res.status(401).json({ message: 'Username atau password salah.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logout berhasil.' });
  });
};

exports.checkAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Harus login dulu.' });
  }
};
