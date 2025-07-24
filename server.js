const express = require('express');
const session = require('express-session');

const app = express();

// Middleware session
app.use(session({
  secret: 'rahasia-super-admin',
  resave: false,
  saveUninitialized: true,
}));

// Middleware parser body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routing
const santriRoutes = require('./routes/santri.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/api', santriRoutes);
app.use('/auth', authRoutes);

// Server berjalan
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
