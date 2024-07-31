const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Path to the JSON file
const testimonialsFilePath = path.join(__dirname, 'testimonials.json');

// Read testimonials from the JSON file
const readTestimonials = () => {
  try {
    const data = fs.readFileSync(testimonialsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading testimonials file:', error);
    return [];
  }
};

// Write testimonials to the JSON file
const writeTestimonials = (testimonials) => {
  try {
    fs.writeFileSync(
      testimonialsFilePath,
      JSON.stringify(testimonials, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error writing testimonials file:', error);
  }
};

// GET route to fetch all testimonials
app.get('/testimonials', (req, res) => {
  const testimonials = readTestimonials();
  res.json(testimonials);
});

// POST route to add a new testimonial
app.post('/testimonials', (req, res) => {
  const newTestimonial = req.body;
  if (!newTestimonial.name || !newTestimonial.message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const testimonials = readTestimonials();
  testimonials.push(newTestimonial);
  writeTestimonials(testimonials);

  res.status(201).json(newTestimonial);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
