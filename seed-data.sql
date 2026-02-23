-- Seed CookingBit with sample recipes

INSERT INTO recipes (name, description, difficulty, deliciousness, creator)
VALUES
  ('Wiener Schnitzel', 'Das klassische Wiener Schnitzel aus zartem Kalbfleisch, paniert und goldbraun gebraten. Serviert mit Kartoffelsalat und Zitronenspalten.', 5, 9, 'Chef Anna'),
  ('Spaghetti Carbonara', 'Cremige Pasta mit Guanciale, Eigelb und Pecorino Romano. Ein echtes italienisches Klassiker-Rezept ohne Sahne!', 4, 10, 'Marco'),
  ('Kaiserschmarrn', 'Fluffiger zerrissener Pfannkuchen mit Rosinen, Puderzucker und Zwetschgenroesti. Perfektes Dessert!', 3, 8, 'Chef Anna'),
  ('Gulasch', 'Herzhaftes ungarisches Gulasch mit zartem Rindfleisch, Paprika und Kartoffeln. Langsam geschmort fuer vollen Geschmack.', 6, 9, 'Thomas'),
  ('Apfelstrudel', 'Traditioneller Apfelstrudel mit duennem Strudelteig, saftigen Aepfeln, Zimt und Rosinen.', 7, 8, 'Chef Anna');

INSERT INTO ingredients (recipe_id, name, amount)
VALUES
  -- Wiener Schnitzel
  (1, 'Kalbsschnitzel', '4 Stueck'),
  (1, 'Mehl', '100g'),
  (1, 'Eier', '3 Stueck'),
  (1, 'Semmelbroesel', '200g'),
  (1, 'Butterschmalz', '200ml'),
  (1, 'Salz und Pfeffer', 'nach Geschmack'),
  (1, 'Zitronen', '2 Stueck'),
  -- Spaghetti Carbonara
  (2, 'Spaghetti', '400g'),
  (2, 'Guanciale', '200g'),
  (2, 'Eigelb', '6 Stueck'),
  (2, 'Pecorino Romano', '100g'),
  (2, 'Schwarzer Pfeffer', 'nach Geschmack'),
  -- Kaiserschmarrn
  (3, 'Mehl', '250g'),
  (3, 'Milch', '375ml'),
  (3, 'Eier', '4 Stueck'),
  (3, 'Zucker', '40g'),
  (3, 'Rosinen', '50g'),
  (3, 'Butter', '40g'),
  (3, 'Puderzucker', 'zum Bestreuen'),
  -- Gulasch
  (4, 'Rindfleisch', '800g'),
  (4, 'Zwiebeln', '4 grosse'),
  (4, 'Paprikapulver', '3 EL'),
  (4, 'Tomatenmark', '2 EL'),
  (4, 'Kartoffeln', '500g'),
  (4, 'Rinderfond', '500ml'),
  -- Apfelstrudel
  (5, 'Strudelteig', '1 Packung'),
  (5, 'Aepfel', '1kg'),
  (5, 'Zucker', '100g'),
  (5, 'Zimt', '2 TL'),
  (5, 'Rosinen', '80g'),
  (5, 'Semmelbroesel', '60g'),
  (5, 'Butter', '60g');

INSERT INTO ratings (recipe_id, difficulty, deliciousness)
VALUES
  (1, 5, 9),
  (1, 6, 10),
  (2, 3, 10),
  (2, 4, 9),
  (3, 2, 8),
  (4, 7, 9),
  (5, 8, 7);
