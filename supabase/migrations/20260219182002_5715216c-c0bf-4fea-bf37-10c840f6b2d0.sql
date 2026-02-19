
-- Create student_reviews table
CREATE TABLE public.student_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_slug TEXT NOT NULL,
  reviewer_name TEXT NOT NULL DEFAULT '',
  course TEXT NOT NULL DEFAULT '',
  batch_year INTEGER NOT NULL DEFAULT 2024,
  rating NUMERIC NOT NULL DEFAULT 4,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  pros TEXT NOT NULL DEFAULT '',
  cons TEXT NOT NULL DEFAULT '',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_reviews ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read student_reviews" ON public.student_reviews FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "Admins can manage student_reviews" ON public.student_reviews FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit reviews
CREATE POLICY "Anyone can submit reviews" ON public.student_reviews FOR INSERT WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_student_reviews_updated_at BEFORE UPDATE ON public.student_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert test data for student reviews
INSERT INTO public.student_reviews (college_slug, reviewer_name, course, batch_year, rating, title, content, pros, cons, is_verified, is_active, display_order) VALUES
('xlri-jamshedpur', 'Rahul Sharma', 'MBA (HRM)', 2024, 4.5, 'Amazing experience at XLRI', 'XLRI has been a transformative experience. The faculty is world-class, campus life is vibrant, and placement opportunities are excellent.', 'Excellent faculty, Great campus life, Top placements', 'High fees, Location could be better', true, true, 1),
('xlri-jamshedpur', 'Priya Patel', 'MBA (BM)', 2023, 5, 'Best B-School for HR', 'The HR program at XLRI is unmatched in India. Industry connections and alumni network are incredibly strong.', 'Best HR program, Strong alumni network, Great ROI', 'Intense workload, Limited city amenities', true, true, 2),
('xlri-jamshedpur', 'Amit Kumar', 'MBA (BM)', 2024, 4, 'Worth every penny', 'Good exposure to real-world business problems through case studies and live projects. Placement season was smooth.', 'Case study approach, Industry exposure, Peer learning', 'Competitive environment, Expensive hostel', false, true, 3);

-- Insert more test colleges
INSERT INTO public.colleges (name, slug, short_name, city, state, location, category, type, established, rating, reviews, courses_count, fees, placement, ranking, description, image, logo, naac_grade, approvals, facilities, highlights, tags, top_recruiters, status, is_active, admission_process, eligibility_criteria, hostel_life, scholarship_details)
VALUES
('Indian Institute of Technology Delhi', 'iit-delhi', 'IIT Delhi', 'New Delhi', 'Delhi', 'Hauz Khas, New Delhi', 'Engineering', 'Government', 1961, 4.8, 2500, 58, '₹2L - ₹3L/year', '₹18 LPA', '#2 NIRF 2025', 'IIT Delhi is one of the premier engineering institutions in India. Known for cutting-edge research and world-class faculty.', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop', '', 'A++', ARRAY['UGC', 'AICTE', 'NAAC'], ARRAY['Library', 'Labs', 'Sports Complex', 'Hostel', 'WiFi', 'Cafeteria'], ARRAY['QS World Ranking: Top 200', '58+ UG/PG programs', '95%+ placement rate'], ARRAY['IIT', 'Top Ranked', 'Government'], ARRAY['Google', 'Microsoft', 'Goldman Sachs', 'McKinsey', 'Amazon', 'Apple'], 'Published', true, 'Admission through JEE Advanced followed by JoSAA counselling.', 'JEE Advanced qualified candidates', 'Vibrant hostel life with 13 hostels on campus', 'Merit-based scholarships available for economically weaker sections'),
('Indian Institute of Management Ahmedabad', 'iim-ahmedabad', 'IIM-A', 'Ahmedabad', 'Gujarat', 'Vastrapur, Ahmedabad', 'Management', 'Government', 1961, 4.9, 3200, 12, '₹23L total', '₹32 LPA', '#1 NIRF MBA 2025', 'IIM Ahmedabad is India''s premier management institution, consistently ranked #1 for MBA programs.', 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop', '', 'A++', ARRAY['UGC', 'AICTE', 'AACSB', 'EQUIS'], ARRAY['Library', 'Computer Labs', 'Sports', 'Hostel', 'Auditorium'], ARRAY['#1 MBA in India', 'Global AACSB accreditation', '100% placement rate', 'Average package ₹32 LPA'], ARRAY['IIM', 'Top MBA', 'Government'], ARRAY['BCG', 'McKinsey', 'Bain', 'Goldman Sachs', 'Google', 'Amazon'], 'Published', true, 'Admission through CAT score, followed by AWT-PI rounds.', 'CAT qualified candidates with 90+ percentile', 'Modern hostel facilities with single rooms', 'Need-based financial aid covering up to 100% tuition'),
('National Law School of India University', 'nlsiu-bangalore', 'NLSIU', 'Bangalore', 'Karnataka', 'Nagarbhavi, Bangalore', 'Law', 'Government', 1986, 4.7, 890, 8, '₹2.5L/year', '₹22 LPA', '#1 NIRF Law 2025', 'NLSIU Bangalore is India''s top law school, pioneering the National Law School movement in India.', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop', '', 'A+', ARRAY['UGC', 'BCI'], ARRAY['Moot Court', 'Library', 'Hostel', 'Sports'], ARRAY['#1 Law School in India', 'Pioneer of NLU system', 'Strong alumni in judiciary'], ARRAY['NLU', 'Top Law', 'Government'], ARRAY['AZB & Partners', 'Cyril Amarchand', 'Khaitan & Co', 'JSA', 'Trilegal'], 'Published', true, 'Admission through CLAT exam followed by counselling.', 'CLAT qualified candidates', 'Spacious hostels with modern amenities', 'Scholarships for SC/ST and merit students'),
('AIIMS New Delhi', 'aiims-delhi', 'AIIMS Delhi', 'New Delhi', 'Delhi', 'Ansari Nagar, New Delhi', 'Medical', 'Government', 1956, 4.9, 4100, 42, '₹6,325/year', '₹15 LPA', '#1 NIRF Medical 2025', 'AIIMS Delhi is India''s premier medical institution, known for affordable world-class medical education and research.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop', '', 'A++', ARRAY['NMC', 'UGC'], ARRAY['Hospital', 'Labs', 'Library', 'Hostel', 'Research Center'], ARRAY['#1 Medical College in India', 'Nominal fees', '42+ courses', 'World-class research'], ARRAY['AIIMS', 'Top Medical', 'Government'], ARRAY['AIIMS Hospital', 'WHO', 'ICMR', 'NIH'], 'Published', true, 'Admission through NEET UG/PG for MBBS and MD/MS programs.', 'NEET qualified candidates with top percentile', 'Free hostel accommodation for students', 'Full scholarship - almost free education')
ON CONFLICT (slug) DO NOTHING;

-- Insert test courses
INSERT INTO public.courses (name, slug, full_name, category, duration, level, avg_fees, avg_salary, growth, description, eligibility, colleges_count, rating, mode, subjects, careers, specializations, status, is_active)
VALUES
('B.Tech', 'btech', 'Bachelor of Technology', 'Engineering', '4 Years', 'Undergraduate', '₹1L - ₹20L', '₹6-12 LPA', '15%', 'B.Tech is a 4-year undergraduate engineering program covering various specializations in technology and engineering.', '10+2 with PCM, JEE Main/Advanced', 4500, 4.5, 'Full-Time', ARRAY['Mathematics', 'Physics', 'Computer Science', 'Electronics'], ARRAY['Software Engineer', 'Data Scientist', 'Product Manager', 'System Architect'], ARRAY['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical'], 'Published', true),
('MBA', 'mba', 'Master of Business Administration', 'Management', '2 Years', 'Postgraduate', '₹5L - ₹25L', '₹12-35 LPA', '20%', 'MBA is a 2-year postgraduate program in business management, offered by top B-Schools across India.', 'Bachelor''s degree with CAT/GMAT score', 3800, 4.6, 'Full-Time', ARRAY['Marketing', 'Finance', 'HR', 'Operations', 'Strategy'], ARRAY['Management Consultant', 'Investment Banker', 'Marketing Manager', 'HR Director'], ARRAY['Finance', 'Marketing', 'HR', 'Operations', 'Analytics', 'Entrepreneurship'], 'Published', true),
('MBBS', 'mbbs', 'Bachelor of Medicine, Bachelor of Surgery', 'Medical', '5.5 Years', 'Undergraduate', '₹10K - ₹25L', '₹8-15 LPA', '12%', 'MBBS is a 5.5-year professional degree in medicine and surgery including 1 year internship.', '10+2 with PCB, NEET UG qualified', 612, 4.7, 'Full-Time', ARRAY['Anatomy', 'Physiology', 'Biochemistry', 'Pharmacology', 'Surgery'], ARRAY['Doctor', 'Surgeon', 'Researcher', 'Medical Officer'], ARRAY['General Medicine', 'Surgery', 'Pediatrics', 'Cardiology', 'Orthopedics'], 'Published', true),
('BA LLB', 'ba-llb', 'Bachelor of Arts and Bachelor of Laws', 'Law', '5 Years', 'Undergraduate', '₹50K - ₹15L', '₹8-22 LPA', '18%', 'BA LLB is a 5-year integrated law degree combining arts and legal studies.', '10+2 any stream, CLAT qualified', 1200, 4.3, 'Full-Time', ARRAY['Constitutional Law', 'Criminal Law', 'Corporate Law', 'International Law'], ARRAY['Advocate', 'Legal Advisor', 'Judge', 'Corporate Lawyer'], ARRAY['Corporate Law', 'Criminal Law', 'IP Law', 'Constitutional Law'], 'Published', true),
('BCA', 'bca', 'Bachelor of Computer Applications', 'Engineering', '3 Years', 'Undergraduate', '₹30K - ₹3L', '₹3-6 LPA', '22%', 'BCA is a 3-year undergraduate degree in computer applications and IT.', '10+2 with Mathematics', 5200, 4.0, 'Full-Time', ARRAY['Programming', 'Database', 'Networking', 'Web Development'], ARRAY['Software Developer', 'Web Developer', 'System Admin', 'IT Analyst'], ARRAY['Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity'], 'Published', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert test exams
INSERT INTO public.exams (name, slug, full_name, category, level, exam_date, applicants, eligibility, mode, description, duration, frequency, status, is_active, is_top_exam, syllabus, top_colleges)
VALUES
('JEE Main', 'jee-main', 'Joint Entrance Examination Main', 'Engineering', 'National', 'April 2026', '12L+', '10+2 with PCM (75% aggregate)', 'Online (CBT)', 'JEE Main is the national-level entrance exam for admission to NITs, IIITs, and other engineering colleges.', '3 Hours', 'Twice a year', 'Upcoming', true, true, ARRAY['Physics', 'Chemistry', 'Mathematics'], ARRAY['NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'IIIT Hyderabad']),
('CAT', 'cat', 'Common Admission Test', 'Management', 'National', 'November 2026', '3L+', 'Bachelor''s degree with 50% marks', 'Online (CBT)', 'CAT is the premier MBA entrance exam for admission to IIMs and top B-Schools in India.', '2 Hours', 'Once a year', 'Upcoming', true, true, ARRAY['Verbal Ability', 'Data Interpretation', 'Logical Reasoning', 'Quantitative Aptitude'], ARRAY['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'XLRI Jamshedpur']),
('NEET UG', 'neet-ug', 'National Eligibility cum Entrance Test (UG)', 'Medical', 'National', 'May 2026', '20L+', '10+2 with PCB (50% aggregate)', 'Offline (Pen & Paper)', 'NEET UG is the single national-level entrance exam for admission to MBBS, BDS, and AYUSH courses.', '3 Hours 20 Min', 'Once a year', 'Upcoming', true, true, ARRAY['Physics', 'Chemistry', 'Biology (Botany & Zoology)'], ARRAY['AIIMS Delhi', 'JIPMER', 'CMC Vellore', 'AFMC Pune']),
('CLAT', 'clat', 'Common Law Admission Test', 'Law', 'National', 'December 2025', '75K+', '10+2 with 45% marks', 'Online (CBT)', 'CLAT is the national-level entrance exam for admission to NLUs for law programs.', '2 Hours', 'Once a year', 'Upcoming', true, true, ARRAY['English', 'Current Affairs', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'], ARRAY['NLSIU Bangalore', 'NALSAR Hyderabad', 'NLU Delhi', 'NUJS Kolkata']),
('GATE', 'gate', 'Graduate Aptitude Test in Engineering', 'Engineering', 'National', 'February 2026', '9L+', 'Bachelor''s in Engineering/Science', 'Online (CBT)', 'GATE is a national-level exam for admission to M.Tech/ME programs and PSU recruitment.', '3 Hours', 'Once a year', 'Upcoming', true, true, ARRAY['Engineering Mathematics', 'General Aptitude', 'Core Subject'], ARRAY['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IISc Bangalore'])
ON CONFLICT (slug) DO NOTHING;

-- Insert test articles
INSERT INTO public.articles (title, slug, category, vertical, description, content, author, featured_image, tags, status, is_active)
VALUES
('Top 10 Engineering Colleges in India 2026', 'top-10-engineering-colleges-2026', 'Rankings', 'colleges', 'A comprehensive ranking of the best engineering colleges in India for 2026 admissions.', 'Here is our detailed analysis of the top engineering colleges...', 'DekhoCampus Team', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop', ARRAY['engineering', 'rankings', '2026'], 'Published', true),
('CAT 2026 Preparation Strategy', 'cat-2026-preparation-strategy', 'Exam Tips', 'exams', 'Complete preparation strategy and tips for CAT 2026 exam aspirants.', 'The CAT exam is one of the most competitive exams in India...', 'DekhoCampus Team', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop', ARRAY['CAT', 'MBA', 'preparation'], 'Published', true),
('NEET 2026: Complete Guide', 'neet-2026-complete-guide', 'Exam Guide', 'exams', 'Everything you need to know about NEET 2026 - dates, syllabus, preparation tips.', 'NEET is the gateway to medical education in India...', 'DekhoCampus Team', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop', ARRAY['NEET', 'medical', 'guide'], 'Published', true),
('MBA vs MCA: Which is Better?', 'mba-vs-mca-comparison', 'Comparison', 'courses', 'A detailed comparison between MBA and MCA to help students choose the right career path.', 'Choosing between MBA and MCA depends on your career goals...', 'DekhoCampus Team', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop', ARRAY['MBA', 'MCA', 'comparison'], 'Published', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert more student reviews for other colleges
INSERT INTO public.student_reviews (college_slug, reviewer_name, course, batch_year, rating, title, content, pros, cons, is_verified, is_active, display_order) VALUES
('iit-delhi', 'Vikram Singh', 'B.Tech CSE', 2024, 5, 'World-class education at minimal cost', 'IIT Delhi provides an unparalleled academic environment. The research opportunities, startup ecosystem, and placement stats speak for themselves.', 'Top faculty, Research focus, Amazing placements, Low fees', 'High competition, Stressful academics', true, true, 1),
('iit-delhi', 'Sneha Gupta', 'M.Tech AI', 2023, 4.5, 'Great for research and AI', 'The AI/ML labs are state-of-the-art. Got to work on real-world projects with industry partners.', 'Cutting-edge research, Industry collaboration, Strong alumni', 'Limited seats, Delhi pollution', true, true, 2),
('iim-ahmedabad', 'Karan Mehta', 'PGP', 2024, 5, 'The Harvard of India - truly!', 'IIM-A transformed my career. Case-based learning, incredible peer group, and unmatched brand value.', 'Best ROI, Global recognition, Top recruiters, Entrepreneurship culture', 'Very expensive, Intense competition', true, true, 1),
('aiims-delhi', 'Dr. Ananya Roy', 'MBBS', 2023, 5, 'Best medical education in India', 'AIIMS Delhi offers unmatched clinical exposure with almost zero fees. The patient load ensures you learn extensively.', 'Free education, Clinical exposure, Research opportunities', 'Extremely competitive, High workload', true, true, 1);

-- Insert popular places
INSERT INTO public.popular_places (name, state, college_count, display_order, is_active, image_url) VALUES
('New Delhi', 'Delhi', 450, 1, true, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop'),
('Mumbai', 'Maharashtra', 380, 2, true, 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop'),
('Bangalore', 'Karnataka', 520, 3, true, 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop'),
('Chennai', 'Tamil Nadu', 410, 4, true, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop'),
('Pune', 'Maharashtra', 340, 5, true, 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=300&h=200&fit=crop'),
('Hyderabad', 'Telangana', 290, 6, true, 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=300&h=200&fit=crop')
ON CONFLICT DO NOTHING;

-- Insert FAQs
INSERT INTO public.faqs (question, answer, page, display_order, is_active) VALUES
('How do I apply for college admissions?', 'You can apply through our platform by visiting the college page and clicking "Apply Now". We also offer free counselling to guide you through the process.', 'homepage', 1, true),
('What entrance exams do I need to take?', 'It depends on your desired course. Engineering requires JEE, Medical requires NEET, MBA requires CAT/GMAT, and Law requires CLAT. Check our Exams section for details.', 'homepage', 2, true),
('Is the counselling service really free?', 'Yes! Our counselling service is completely free. Our experts will help you choose the right college and course based on your profile.', 'homepage', 3, true),
('How accurate are the college rankings?', 'Our rankings are based on NIRF, employer reputation, alumni outcomes, and student feedback. We update them annually to ensure accuracy.', 'homepage', 4, true)
ON CONFLICT DO NOTHING;
