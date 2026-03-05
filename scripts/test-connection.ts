// Detailed Neon Connection Diagnostic
import pg from 'pg';
import 'dotenv/config';

console.log('🔍 Neon Connection Diagnostics\n');

// Check environment variables
console.log('1️⃣ Environment Check:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DIRECT_DATABASE_URL exists:', !!process.env.DIRECT_DATABASE_URL);

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log('Host:', url.hostname);
  console.log('Port:', url.port || '5432');
  console.log('Database:', url.pathname.replace('/', ''));
  console.log('User:', url.username);
  console.log('SSL Mode:', url.searchParams.get('sslmode'));
}
console.log('');

// Test connection with detailed error logging
console.log('2️⃣ Testing Connection...');

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_DATABASE_URL,
  connectionTimeoutMillis: 15000,
  ssl: { rejectUnauthorized: false },
  // Add query timeout
  statement_timeout: 10000,
});

// Listen to connection events
pool.on('error', (err) => {
  console.error('❌ Unexpected pool error:', err);
});

pool.on('connect', () => {
  console.log('✅ Pool connected');
});

const testConnection = async () => {
  try {
    console.log('Attempting connection...');
    const client = await pool.connect();
    console.log('✅ Client acquired from pool');
    
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('\n✅ Connected successfully!');
    console.log('PostgreSQL:', result.rows[0].version.split(' ')[1]);
    console.log('Database:', result.rows[0].current_database);
    console.log('User:', result.rows[0].current_user);
    
    // Test table access
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log('\nTables found:', tables.rows.length);
    tables.rows.forEach(row => console.log('  -', row.tablename));
    
    client.release();
    return true;
  } catch (error: any) {
    console.error('\n❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    return false;
  } finally {
    await pool.end();
  }
};

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
