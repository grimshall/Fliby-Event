require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const eventRoutes = require('./routes/events');

app.use('/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Fliby Event API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});