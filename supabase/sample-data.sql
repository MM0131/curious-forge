-- Migration: Insert sample blueprints from existing data
-- Run this in Supabase SQL Editor after creating the schema

INSERT INTO blueprints (
  title, description, category, difficulty, duration,
  materials, tools, steps, science_explanation, safety_notes,
  image_url, status, views, likes
) VALUES 
(
  'DIY Volcano Eruption',
  'Create a realistic volcanic eruption using simple chemistry',
  'chemistry',
  'beginner',
  '30-45 minutes',
  '["Baking soda", "Vinegar", "Red food coloring", "Dish soap", "Water", "Clay or paper mache", "Plastic bottle"]'::jsonb,
  '["Mixing bowl", "Spoon", "Tray to catch overflow"]'::jsonb,
  '[
    {"number": 1, "title": "Build the volcano structure", "description": "Shape clay or paper mache around a plastic bottle to form a volcano shape. Leave the bottle opening exposed at the top."},
    {"number": 2, "title": "Prepare the lava mixture", "description": "Add 2 tablespoons of baking soda inside the bottle. Add a few drops of red food coloring and a squirt of dish soap."},
    {"number": 3, "title": "Trigger the eruption", "description": "Pour 1/2 cup of vinegar into the bottle and watch it erupt! The reaction creates carbon dioxide gas that pushes the foam out."}
  ]'::jsonb,
  'This experiment demonstrates an acid-base reaction. When vinegar (acetic acid) mixes with baking soda (sodium bicarbonate), it produces carbon dioxide gas, water, and sodium acetate. The gas bubbles create pressure that forces the mixture to overflow, simulating a volcanic eruption.',
  '["Adult supervision recommended", "Wear safety goggles", "Do experiment on a tray or outdoors", "Avoid touching or tasting the mixture"]'::jsonb,
  '/assets/images/volcano.jpg',
  'published',
  150,
  23
),
(
  'Homemade Battery',
  'Generate electricity using fruits and vegetables',
  'physics',
  'intermediate',
  '45-60 minutes',
  '["Lemons or potatoes", "Copper wire or pennies", "Galvanized nails or screws", "Alligator clips", "LED light or small clock"]'::jsonb,
  '["Knife (adult use only)", "Multimeter (optional)"]'::jsonb,
  '[
    {"number": 1, "title": "Prepare the fruits", "description": "Cut small slits in each lemon or potato to insert the electrodes."},
    {"number": 2, "title": "Insert electrodes", "description": "Push a copper wire into one slit and a galvanized nail into another slit on each fruit. Make sure they don''t touch inside."},
    {"number": 3, "title": "Connect in series", "description": "Use alligator clips to connect the copper of one fruit to the nail of the next fruit, creating a chain."},
    {"number": 4, "title": "Test your battery", "description": "Connect the free copper and nail ends to your LED or clock and watch it light up!"}
  ]'::jsonb,
  'This creates an electrochemical cell. The citric acid in lemons (or phosphoric acid in potatoes) acts as an electrolyte. The zinc coating on the nail and the copper create a voltage difference. When connected, electrons flow from zinc to copper through your device, creating electricity.',
  '["Use knife with adult supervision", "Wash hands after handling materials", "Do not eat the fruits after experiment"]'::jsonb,
  '/assets/images/battery.jpg',
  'published',
  230,
  45
),
(
  'Camera Obscura / Pinhole Camera',
  'Build a simple camera using a cardboard box to understand optics',
  'physics',
  'intermediate',
  '60-90 minutes',
  '["Cardboard box", "Aluminum foil", "Wax paper or tracing paper", "Black tape", "Black paint or paper"]'::jsonb,
  '["Scissors", "Pin or needle", "Ruler"]'::jsonb,
  '[
    {"number": 1, "title": "Prepare the box", "description": "Paint the inside of the box black or line it with black paper to prevent light reflection."},
    {"number": 2, "title": "Create the pinhole", "description": "Make a small hole in the center of one end of the box. Cover it with aluminum foil and use a pin to make a tiny, clean hole in the foil."},
    {"number": 3, "title": "Add the screen", "description": "Cut a square opening on the opposite end and tape wax paper over it to act as a viewing screen."},
    {"number": 4, "title": "Use your camera", "description": "Point the pinhole at a bright object or light source. Look at the wax paper screen from the back to see an inverted image!"}
  ]'::jsonb,
  'Light travels in straight lines. When light rays from an object pass through the tiny pinhole, they create an inverted image on the opposite side. This is the same principle used in your eye and in early cameras. The smaller the pinhole, the sharper but dimmer the image.',
  '["Use sharp tools carefully", "Adult supervision for cutting"]'::jsonb,
  '/assets/images/camera-obscura.jpg',
  'published',
  180,
  38
);

-- Add more blueprints as needed
