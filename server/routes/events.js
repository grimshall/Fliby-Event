const express = require('express');
const router = express.Router();

const supabase = require('../supabaseClient');

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
});


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

let image = '';

if (req.files.image) {

  const file = req.files.image[0];

  const fileName =
    `${Date.now()}-${file.originalname}`;

  const { error: uploadError } =
    await supabase.storage
      .from('event-images')
      .upload(
        fileName,
        file.buffer,
        {
          contentType: file.mimetype,
        }
      );

  if (uploadError) {
    console.log(uploadError);

    return res.status(500).json({
      error: uploadError.message,
    });
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from('event-images')
    .getPublicUrl(fileName);

  image = publicUrl;
}

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