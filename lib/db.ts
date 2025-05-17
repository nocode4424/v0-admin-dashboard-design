import { neon } from "@neondatabase/serverless"

// Create a SQL client with the database URL from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to check if tables exist and create them if they don't
export async function initializeDatabase() {
  try {
    // Check if restaurants table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'restaurants'
      );
    `

    if (!tableExists[0].exists) {
      await createTables()
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return { success: false, error }
  }
}

// Helper function to check if database is initialized
export async function isDatabaseInitialized() {
  try {
    // Check if users table exists and has at least one user
    const result = await sql`
      SELECT EXISTS (
        SELECT 1 FROM users LIMIT 1
      );
    `
    return result[0]?.exists || false
  } catch (error) {
    console.error("Error checking database initialization:", error)
    return false
  }
}

// Helper function to format database errors for display
export function formatDbError(error: any): string {
  if (error?.message) {
    // Remove sensitive information like connection strings
    return error.message.replace(/postgresql:\/\/[^@]*@[^/]*/g, "postgresql://[redacted]")
  }
  return "An unexpected database error occurred"
}

// Create all necessary tables
async function createTables() {
  await sql`
    CREATE TABLE restaurants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      logo_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zip_code VARCHAR(20) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(255),
      delivery_radius DECIMAL(5,2) DEFAULT 4.9,
      delivery_fee DECIMAL(10,2) DEFAULT 7.99,
      convenience_fee_percentage DECIMAL(5,2) DEFAULT 5.0,
      tax_rate DECIMAL(5,2) DEFAULT 8.0,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) NOT NULL,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE hours_of_operation (
      id SERIAL PRIMARY KEY,
      location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
      day_of_week INTEGER NOT NULL,
      open_time TIME NOT NULL,
      close_time TIME NOT NULL,
      is_closed BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(location_id, day_of_week)
    );

    CREATE TABLE categories (
      id SERIAL PRIMARY KEY,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE menu_items (
      id SERIAL PRIMARY KEY,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      is_available BOOLEAN DEFAULT true,
      prep_time INTEGER,
      is_vegetarian BOOLEAN DEFAULT false,
      is_vegan BOOLEAN DEFAULT false,
      is_gluten_free BOOLEAN DEFAULT false,
      allow_special_instructions BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE SET NULL,
      location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
      customer_id INTEGER,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'received',
      subtotal DECIMAL(10,2) NOT NULL,
      tax DECIMAL(10,2) NOT NULL,
      delivery_fee DECIMAL(10,2) DEFAULT 0,
      convenience_fee DECIMAL(10,2) DEFAULT 0,
      tip DECIMAL(10,2) DEFAULT 0,
      total DECIMAL(10,2) NOT NULL,
      is_delivery BOOLEAN DEFAULT false,
      delivery_address TEXT,
      special_instructions TEXT,
      payment_method VARCHAR(50),
      payment_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
}
