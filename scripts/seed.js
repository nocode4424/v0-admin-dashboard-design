const { execSync } = require("child_process")
const { randomUUID } = require("crypto")
const bcrypt = require("bcrypt")

async function main() {
  try {
    console.log("🌱 Seeding database...")

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const userId = randomUUID()

    // Execute SQL to create admin user
    const createAdminUserSQL = `
      INSERT INTO "User" (
        id, 
        email, 
        username, 
        password, 
        name, 
        role, 
        "createdAt", 
        "updatedAt"
      ) 
      VALUES (
        '${userId}', 
        'admin@example.com', 
        'admin', 
        '${hashedPassword}', 
        'System Administrator', 
        'SUPER_ADMIN', 
        NOW(), 
        NOW()
      )
      ON CONFLICT (username) DO NOTHING;
    `

    // Use environment variable to connect to database
    const { POSTGRES_URL } = process.env

    if (!POSTGRES_URL) {
      throw new Error("POSTGRES_URL environment variable is not set")
    }

    // Execute SQL using psql
    execSync(`echo "${createAdminUserSQL}" | psql ${POSTGRES_URL}`)

    console.log("✅ Admin user created successfully")
    console.log("Username: admin")
    console.log("Password: admin123")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

main()
