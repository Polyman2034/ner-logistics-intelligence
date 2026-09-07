-- ====================================================================
-- NER Logistics Intelligence Platform
-- Seed Data for North Eastern Region of India
-- ====================================================================

-- Seed Districts
INSERT INTO districts (id, name, state, headquarters, risk_level, accessible_roads_ratio) VALUES
('dist-kamrup', 'Kamrup Metropolitan (Guwahati)', 'Assam', 'Guwahati', 'Low', 0.94),
('dist-tawang', 'Tawang', 'Arunachal Pradesh', 'Tawang', 'High', 0.62),
('dist-east-khasi', 'East Khasi Hills (Shillong)', 'Meghalaya', 'Shillong', 'Medium', 0.81),
('dist-imphal-west', 'Imphal West', 'Manipur', 'Imphal', 'High', 0.70),
('dist-aizawl', 'Aizawl', 'Mizoram', 'Aizawl', 'Medium', 0.78),
('dist-kohima', 'Kohima', 'Nagaland', 'Kohima', 'High', 0.68),
('dist-west-tripura', 'West Tripura (Agartala)', 'Tripura', 'Agartala', 'Low', 0.95),
('dist-east-sikkim', 'East Sikkim (Gangtok)', 'Sikkim', 'Gangtok', 'Critical', 0.54),
('dist-cachar', 'Cachar (Silchar)', 'Assam', 'Silchar', 'Medium', 0.85)
ON CONFLICT (id) DO NOTHING;

-- Seed Arterial Roads
INSERT INTO roads (id, code, name, district_id, state, status, length_km, elevation_gradient, estimated_delay_minutes, risk_score, weather_condition) VALUES
('road-nh-27', 'NH-27', 'East-West Highway (Bongaigaon - Guwahati - Nagaon)', 'dist-kamrup', 'Assam', 'ACCESSIBLE', 188.0, 'River Valley', 0, 18, 'Scattered Clouds, 27°C'),
('road-nh-6', 'NH-6', 'Guwahati - Shillong - Silchar Corridor', 'dist-east-khasi', 'Meghalaya', 'CAUTION', 215.0, 'High Mountain', 45, 58, 'Monsoon Downpour, 19°C'),
('road-nh-13', 'NH-13', 'Trans-Arunachal Highway (Bhalukpong - Bomdila - Sela - Tawang)', 'dist-tawang', 'Arunachal Pradesh', 'BLOCKED', 174.0, 'High Mountain', 240, 88, 'Heavy Sleet & Dense Fog, 4°C'),
('road-nh-29', 'NH-29', 'Dimapur - Kohima - Maram Highway', 'dist-kohima', 'Nagaland', 'CAUTION', 74.0, 'High Mountain', 60, 62, 'Intermittent Rain, 18°C'),
('road-nh-10', 'NH-10', 'Sevoke - Teesta - Rangpo - Gangtok Lifeline', 'dist-east-sikkim', 'Sikkim', 'BLOCKED', 98.0, 'River Valley & Cliff', 360, 94, 'Cloudburst & River Overflow, 14°C'),
('road-nh-306', 'NH-306', 'Silchar - Vairengte - Kolasib - Aizawl Arterial', 'dist-aizawl', 'Mizoram', 'ACCESSIBLE', 130.0, 'Foothills', 10, 28, 'Light Mist, 22°C')
ON CONFLICT (id) DO NOTHING;
