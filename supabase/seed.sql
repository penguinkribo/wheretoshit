-- Seed data: 5 real Singapore public toilets
insert into public.toilets (name, address, lat, lng, has_bidet, is_free) values
  ('ION Orchard Public Restroom', '2 Orchard Turn, ION Orchard, Singapore 238801', 1.3040, 103.8318, true, true),
  ('Marina Bay Sands Shoppes Restroom', '10 Bayfront Ave, Singapore 018956', 1.2834, 103.8607, true, true),
  ('Bugis Junction Restroom', '200 Victoria St, Bugis Junction, Singapore 188021', 1.2993, 103.8554, false, true),
  ('Chinatown Point Restroom', '133 New Bridge Rd, Chinatown Point, Singapore 059413', 1.2854, 103.8447, false, false),
  ('HDB Hub Toa Payoh Restroom', '480 Lor 6 Toa Payoh, HDB Hub, Singapore 310480', 1.3326, 103.8471, true, true);
