/**
 * Backend Database Schema Definition (PostgreSQL / Relational)
 * 
 * Standard SQL & Schema definition ready for PostgreSQL migration or ORM (Prisma / Drizzle)
 */

export interface DbMember {
  id: string; // SVS-MEM-1082
  name: string;
  phone: string;
  email: string;
  tier: 'Silver' | 'Gold' | 'Diamond' | 'Platinum';
  venture: string;
  plot_no: string;
  area_sq_yd: number;
  reg_number: string;
  paid_amount: number;
  total_amount: number;
  staycation_credits: number;
  kyc_status: 'Verified' | 'Pending' | 'Action Needed';
  address?: string;
  pan_no?: string;
  nominee_name?: string;
  registered_date: string;
  status: 'Active' | 'Suspended' | 'In Review';
  notes?: string;
}

export interface DbMemberRequest {
  id: string; // SVS-REQ-XXXXXX
  member_id: string;
  service_type: string;
  preferred_date?: string;
  guest_count?: number;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  admin_notes?: string;
  form_data?: Record<string, any>;
  created_at: string;
}

export interface DbMemberAppAd {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  download_url: string;
  features: string[];
  is_active: boolean;
}

/**
 * SQL DDL Definition for standalone PostgreSQL deployment
 */
export const POSTGRES_SCHEMA_SQL = `
-- 1. Members Table
CREATE TABLE IF NOT EXISTS members (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(150),
  tier VARCHAR(20) DEFAULT 'Gold' CHECK (tier IN ('Silver', 'Gold', 'Diamond', 'Platinum')),
  venture VARCHAR(200) NOT NULL,
  plot_no VARCHAR(100) NOT NULL,
  area_sq_yd NUMERIC(10,2) DEFAULT 200,
  reg_number VARCHAR(100),
  paid_amount NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) DEFAULT 0,
  staycation_credits INT DEFAULT 2,
  kyc_status VARCHAR(30) DEFAULT 'Verified',
  address TEXT,
  pan_no VARCHAR(20),
  nominee_name VARCHAR(150),
  registered_date VARCHAR(50),
  status VARCHAR(30) DEFAULT 'Active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Member Requests / Bookings Table
CREATE TABLE IF NOT EXISTS member_requests (
  id VARCHAR(50) PRIMARY KEY,
  member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
  service_type VARCHAR(150) NOT NULL,
  preferred_date VARCHAR(100),
  guest_count INT DEFAULT 1,
  notes TEXT,
  status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Completed', 'Rejected')),
  admin_notes TEXT,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Member App Promo / Announcements
CREATE TABLE IF NOT EXISTS member_app_ads (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  badge VARCHAR(100),
  download_url TEXT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;
