const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const supabase = require('../supabaseClient');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
});

router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        category,
        date,
        place,
        state,
        price,
        description,
        benefits,
        host_name,
        host_id,
      } = req.body;

      const image = req.files.image
        ? `http://localhost:5000/uploads/${req.files.image[0].filename}`
        : '';

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            category,
            date,
            place,
            state,
            price,
            image,
            description,
            benefits: JSON.parse(benefits),
            host_name,
            host_id,
          },
        ]);

      if (error) {
        console.log(error);

        return res.status(500).json({
          error: error.message,
        });
      }

      res.json(data);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        error: 'Server error',
      });
    }
  }
);

module.exports = router;