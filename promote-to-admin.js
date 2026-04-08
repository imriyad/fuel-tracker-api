/**
 * Promote a user to admin role
 * Usage: node promote-to-admin.js <email>
 * Example: node promote-to-admin.js your-email@example.com
 */

require('dotenv').config();
const { query } = require('./src/config/database');

const promoteToAdmin = async (email) => {
  if (!email) {
    console.error('❌ Error: Please provide an email address');
    console.log('Usage: node promote-to-admin.js <email>');
    process.exit(1);
  }

  try {
    console.log(`🔍 Looking for user with email: ${email}...`);
    
    // Check if user exists
    const userResult = await query('SELECT id, name, email, role FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      console.error('❌ Error: User not found with this email address');
      process.exit(1);
    }

    const user = userResult.rows[0];
    
    if (user.role === 'admin') {
      console.log('✅ User is already an admin!');
      process.exit(0);
    }

    // Update user role to admin
    await query('UPDATE users SET role = $1 WHERE id = $2', ['admin', user.id]);
    
    console.log('✅ Success! User has been promoted to admin:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: admin`);
    console.log('\n📝 Note: Please log out and log back in to get the new admin role.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Get email from command line argument
const email = process.argv[2];
promoteToAdmin(email);