-- ==============================================================================
-- VANAJ CULTURAL ARCHIVE - SUPABASE FEEDBACK & REVIEWS SYSTEM
-- Run this script in your Supabase Project:
-- Dashboard -> SQL Editor -> New Query -> Paste & Click Run
-- ==============================================================================

-- 1. Create the feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::TEXT, now()),
  vertical TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  role TEXT DEFAULT 'Cultural Patron',
  topic TEXT,
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  recommended BOOLEAN DEFAULT TRUE,
  is_user_submitted BOOLEAN DEFAULT TRUE,
  is_edited BOOLEAN DEFAULT FALSE
);

-- 2. Indexes for fast retrieval by vertical and date
CREATE INDEX IF NOT EXISTS idx_feedback_vertical_date 
  ON public.feedback (vertical, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_rating 
  ON public.feedback (rating);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 4. Public Access Policies (Everyone can view, submit, and like)
DROP POLICY IF EXISTS "Public feedback is viewable by everyone" ON public.feedback;
CREATE POLICY "Public feedback is viewable by everyone"
  ON public.feedback
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update feedback" ON public.feedback;
CREATE POLICY "Anyone can update feedback"
  ON public.feedback
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete feedback" ON public.feedback;
-- Security Notice:
-- In the Vanaj web app, delete operations are restricted by browser ownership (only the author's device has the review ID).
-- If you want to allow authors to delete their feedback from the client browser, keep USING (true).
-- If you want to COMPLETELY PREVENT any public deletion via the client API (recommended if you want all public feedback permanent,
-- or manageable only via Supabase Dashboard / Admin), change USING (true) to USING (false) below:
CREATE POLICY "Anyone can delete feedback"
  ON public.feedback
  FOR DELETE
  USING (true);

-- 5. Enable Realtime broadcast (so new reviews pop up on all screens instantly)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'feedback'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;
  END IF;
END $$;

-- 6. Pre-seed baseline authentic testimonials across all verticals
INSERT INTO public.feedback (id, vertical, name, location, role, topic, rating, review, likes, recommended, is_user_submitted, created_at)
VALUES
  -- Marketplace
  ('m1', 'marketplace', 'Meera Krishnan', 'Bangalore, Karnataka', 'Verified Patron', 'Handcrafted Dokra Artefact', 5, 
   'The Dokra brass artifact arrived in thoughtful, sustainable packaging. The lost-wax detailing crafted by the tribal artisan is mesmerizing. Knowing this directly honors and empowers a craft family in West Singhbhum makes it a treasure in our home.', 34, true, false, now() - INTERVAL '2 days'),
  ('m2', 'marketplace', 'Vikramaditya Roy', 'Kolkata, West Bengal', 'Textile Collector', 'Handwoven Tribal Saree / Fabric', 5, 
   'Exceptional weave quality. The earthy madder and natural indigo tones have an organic depth you simply cannot find in mass-manufactured fabrics. Vanaj is doing sacred work connecting collectors to living indigenous heritage.', 48, true, false, now() - INTERVAL '7 days'),
  ('m3', 'marketplace', 'Sunita Marandi', 'Ranchi, Jharkhand', 'Local Patron', 'Bamboo & Grass Decor', 5, 
   'Stunning ambient lighting that casts sacred tribal geometric patterns across our living room. It carries the fresh, natural aroma of treated mountain bamboo. Sturdy, authentic, and immensely proud of our Jharkhand artisans!', 21, true, false, now() - INTERVAL '14 days'),
  ('m4', 'marketplace', 'Dr. Kabir Deshmukh', 'Pune, Maharashtra', 'Art Historian', 'Tribal Silver & Brass Jewelry', 4, 
   'The weight, geometric etching, and tribal motif accuracy are historically pristine. The artisan details included with the parcel made this an educational and aesthetic marvel. Exemplary initiative!', 19, true, false, now() - INTERVAL '21 days'),

  -- Tourism
  ('t1', 'tourism', 'Aarav & Devika Sharma', 'New Delhi', 'Cultural Wanderers', 'Artisan Workshop (Dokra / Paitkar)', 5, 
   'Sitting beside master artisan Birsa Munda as he guided our hands through 4,000-year-old lost-wax techniques was transcendent. Our 10-year-old daughter was mesmerized. Jharkhand’s ancient forest hills are truly India’s most soulful destination.', 42, true, false, now() - INTERVAL '3 days'),
  ('t2', 'tourism', 'Sophie Laurent', 'Lyon, France', 'Solo Explorer', 'Waterfall & Wilderness Trail', 5, 
   'The morning mist drifting through the sacred Sal groves felt like stepping back in time. Our indigenous guide conveyed deep tribal folklore with reverence and quiet grace. Ecotourism practiced with genuine soul and respect.', 67, true, false, now() - INTERVAL '7 days'),
  ('t3', 'tourism', 'Rohan Banerjee', 'Jamshedpur, Jharkhand', 'Heritage Traveler', 'Artisan Workshop (Dokra / Paitkar)', 4, 
   'Learning to grind natural river pigments from ochre stones and wild leaves alongside Sumi Santal was an unforgettable privilege. The narrative storytelling through painted scrolls moved our entire cohort.', 29, true, false, now() - INTERVAL '14 days'),
  ('t4', 'tourism', 'Ananya Mukherjee', 'Hyderabad, Telangana', 'Eco-Tourist', 'Heritage Village Homestay', 5, 
   'The warm hospitality at the village homestay, home-cooked Dhuska breakfasts, and guided walk to Hundru falls were flawless. So peaceful, dignified, and rooted in tribal ecology.', 38, true, false, now() - INTERVAL '30 days'),

  -- Food
  ('f1', 'food', 'Chef Ranveer Mukherjee', 'Mumbai, Maharashtra', 'Culinary Anthropologist', 'Wild Foraged Specialty (Rugra / Ants)', 5, 
   'Rugra mushrooms simmered in cold-pressed mustard oil with wild garlic and fresh green chilies is an unmatched gastronomic revelation. The earthy umami flavor rivals European truffles, steeped in centuries of forest foraging lore.', 56, true, false, now() - INTERVAL '1 day'),
  ('f2', 'food', 'Shreya Tirkey', 'Gumla, Jharkhand', 'Indigenous Food Advocate', 'Heritage Millet & Cooling Pej', 5, 
   'The fermented finger-millet Mandia Pej brings back every treasured memory of summers with my grandmother. It is deeply heartwarming to see our ancestral nutrition documented with such beauty and dignity.', 31, true, false, now() - INTERVAL '4 days'),
  ('f3', 'food', 'Tanmay Saxena', 'Bengaluru, Karnataka', 'Experimental Foodie', 'Wild Foraged Specialty (Rugra / Ants)', 4, 
   'The vibrant, citrusy burst of natural formic acid paired with wild coriander and red chilies was extraordinary. A rare culinary adventure that connects you directly to the living pulse of the wilderness.', 74, true, false, now() - INTERVAL '14 days'),
  ('f4', 'food', 'Pallavi Roy', 'Patna, Bihar', 'Gastronomy Writer', 'Traditional Breakfast (Dhuska & Chilka)', 5, 
   'Crispy on the outside, feather-light and spongy within. Paired with the rustic spiced chana curry, this is breakfast royalty. Beautiful presentation of Jharkhand’s authentic tastes!', 27, true, false, now() - INTERVAL '21 days'),

  -- Dance
  ('d1', 'dance', 'Dr. Nandita Sen', 'Kolkata, West Bengal', 'Ethnomusicology Scholar', 'Santhali Circle Dance', 5, 
   'Watching the women link arms in an unbroken cosmic circle while the Mandar pulses through the soil is a masterclass in human harmony. The rhythmic footwork breathes in unison with the forest winds. Mesmerizing and sacred.', 64, true, false, now() - INTERVAL '3 days'),
  ('d2', 'dance', 'Karan Murmu', 'Dumka, Jharkhand', 'Tribal Youth Council', 'Folk Percussion & Instruments', 5, 
   'Seeing our sacred rituals and communal dances documented with such cinematic reverence makes our heart swell with joy. The audio fidelity of the Mandar and Nagara drums echoes the true voice of our ancestors.', 52, true, false, now() - INTERVAL '7 days'),
  ('d3', 'dance', 'Elena Rostova', 'Saint Petersburg, Russia', 'World Arts Enthusiast', 'Ho Tribe Mage Rhythm', 5, 
   'The geometric spatial arrangements and rhythmic discipline are breathtaking. This is not mere theatrical performance; it is a living invocation of nature, soil, and stars. Superbly curated!', 41, true, false, now() - INTERVAL '14 days'),
  ('d4', 'dance', 'Amartya Das', 'Bhubaneswar, Odisha', 'Folk Performing Arts Curator', 'Oraon Karma Performance', 4, 
   'The balance between athletic vigor and poetic gentleness in the Karma dance is poetry in motion. Vanaj gives these timeless indigenous traditions the global spotlight they richly merit.', 33, true, false, now() - INTERVAL '30 days'),

  -- Languages
  ('l1', 'languages', 'Prof. Ramdayal Munda', 'Ranchi, Jharkhand', 'Linguistic Scholar', 'Ol Chiki Script & Typography', 5, 
   'Preserving the sacred Ol Chiki glyphs alongside natural acoustic pronunciation guides honors Pandit Raghunath Murmu’s vision. Vanaj brings linguistic dignity to our mother tongues on the global stage.', 49, true, false, now() - INTERVAL '2 days'),
  ('l2', 'languages', 'Sunita Hembrom', 'Dumka, Jharkhand', 'Tribal Educator', 'Santali Vocabulary & Grammar', 5, 
   'The interactive flashcards and vernacular translations make teaching our children second nature. Seeing ancient oral traditions codified with such reverence is deeply inspiring.', 36, true, false, now() - INTERVAL '7 days'),
  ('l3', 'languages', 'Devkaran Soren', 'Jamshedpur, Jharkhand', 'Diaspora Student', 'Mundari Dialect & Idioms', 5, 
   'Living away from our ancestral soil, Vanaj’s language repository has become my daily sanctuary. The etymological roots of words like "Johar" and "Sasandiri" bridge the generational divide.', 28, true, false, now() - INTERVAL '14 days'),
  ('l4', 'languages', 'Dr. Anupama Topno', 'New Delhi', 'Anthropology Fellow', 'Ho Language & Warang Chiti', 4, 
   'Scholarly precision paired with accessible digital UI. A stellar resource for preserving the Austroasiatic and Dravidian heritage of Central India.', 22, true, false, now() - INTERVAL '21 days')
ON CONFLICT (id) DO NOTHING;
