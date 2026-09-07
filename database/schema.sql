-- ====================================================================
-- PANDAVAS NER Logistics Intelligence Platform
-- PostgreSQL / PostGIS / Supabase Database Schema
-- ====================================================================

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES
CREATE TYPE user_role AS ENUM (
  'GOVERNMENT_ADMIN',
  'DISTRICT_AUTHORITY',
  'FIELD_OFFICER',
  'TRANSPORT_MANAGER',
  'DRIVER',
  'EMERGENCY_OFFICER',
  'SYSTEM_ADMIN'
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  username VARCHAR(100) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'FIELD_OFFICER',
  district_id VARCHAR(100),
  district_name VARCHAR(255),
  state VARCHAR(100) DEFAULT 'Assam',
  organization VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DISTRICTS
CREATE TABLE IF NOT EXISTS districts (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  headquarters VARCHAR(255),
  location GEOMETRY(Point, 4326),
  risk_level VARCHAR(50) DEFAULT 'Low',
  accessible_roads_ratio NUMERIC(5, 2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROADS & HIGHWAYS
CREATE TYPE road_accessibility_status AS ENUM (
  'ACCESSIBLE',
  'CAUTION',
  'BLOCKED',
  'UNKNOWN'
);

CREATE TABLE IF NOT EXISTS roads (
  id VARCHAR(100) PRIMARY KEY,
  code VARCHAR(50) NOT NULL, -- e.g. NH-27, NH-13
  name VARCHAR(255) NOT NULL,
  district_id VARCHAR(100) REFERENCES districts(id),
  state VARCHAR(100) NOT NULL,
  status road_accessibility_status DEFAULT 'ACCESSIBLE',
  geometry GEOMETRY(LineString, 4326),
  length_km NUMERIC(8, 2),
  elevation_gradient VARCHAR(100),
  estimated_delay_minutes INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 20,
  weather_condition VARCHAR(255),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INCIDENTS & HAZARDS
CREATE TYPE incident_type AS ENUM (
  'Road Blockage',
  'Landslide',
  'Flood',
  'Road Damage',
  'Bridge Damage',
  'Traffic',
  'Accident',
  'Weather Hazard',
  'Other'
);

CREATE TYPE incident_severity AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

CREATE TYPE incident_status AS ENUM (
  'Reported',
  'Pending Verification',
  'Verified',
  'Rejected',
  'Resolved'
);

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type incident_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location GEOMETRY(Point, 4326) NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  road_id VARCHAR(100) REFERENCES roads(id),
  district_id VARCHAR(100) REFERENCES districts(id),
  severity incident_severity DEFAULT 'MEDIUM',
  status incident_status DEFAULT 'Pending Verification',
  photo_url TEXT,
  reporter_id UUID REFERENCES users(id),
  reporter_name VARCHAR(255),
  reporter_role user_role,
  verified_by VARCHAR(255),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  is_offline_submitted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VEHICLES
CREATE TYPE vehicle_status AS ENUM (
  'IDLE',
  'ASSIGNED',
  'IN_TRANSIT',
  'MAINTENANCE'
);

CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(100) PRIMARY KEY,
  registration_no VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(100) NOT NULL,
  driver_id UUID REFERENCES users(id),
  driver_name VARCHAR(255),
  status vehicle_status DEFAULT 'IDLE',
  current_location GEOMETRY(Point, 4326),
  current_lat NUMERIC(10, 6),
  current_lng NUMERIC(10, 6),
  speed_kmh NUMERIC(5, 2) DEFAULT 0,
  heading NUMERIC(5, 2) DEFAULT 0,
  fuel_level_percent INTEGER DEFAULT 100,
  last_ping TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DELIVERIES
CREATE TYPE delivery_priority AS ENUM (
  'NORMAL',
  'HIGH',
  'CRITICAL_SOS'
);

CREATE TYPE delivery_status AS ENUM (
  'Created',
  'Assigned',
  'Picked Up',
  'In Transit',
  'Delayed',
  'Delivered',
  'Cancelled'
);

CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_code VARCHAR(100) UNIQUE NOT NULL,
  commodity VARCHAR(255) NOT NULL,
  priority delivery_priority DEFAULT 'NORMAL',
  origin VARCHAR(255) NOT NULL,
  origin_coords GEOMETRY(Point, 4326),
  destination VARCHAR(255) NOT NULL,
  destination_coords GEOMETRY(Point, 4326),
  vehicle_id VARCHAR(100) REFERENCES vehicles(id),
  driver_id UUID REFERENCES users(id),
  status delivery_status DEFAULT 'Created',
  eta VARCHAR(100),
  distance_km NUMERIC(8, 2),
  current_route_id VARCHAR(100),
  alternate_route_id VARCHAR(100),
  risk_score INTEGER DEFAULT 30,
  assigned_district VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100),
  user_name VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  severity VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  road_id VARCHAR(100),
  district_id VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  target_roles TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Spatial Indexing for Fast Querying
CREATE INDEX IF NOT EXISTS idx_roads_geom ON roads USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_incidents_loc ON incidents USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_vehicles_loc ON vehicles USING GIST(current_location);
