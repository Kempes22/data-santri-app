const express = require('express');
const app = express();
const santriRoutes = require('./routes/santri.routes');

app.use(express.urlencoded({ extended: true }));
app.use('/api', santriRoutes);

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
