/** @type { import ("drizzle—kit") . Config } */
export default {
    schema: "./utils/schema.js" ,
    dialect:'postgresql',
    dbCredentials: {
    url: 'postgresql://neondb_owner:npg_SX5qekiR6vAD@ep-shiny-surf-a86g6sn0.eastus2.azure.neon.tech/MockMate?sslmode=require',
    }
};