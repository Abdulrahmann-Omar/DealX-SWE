import app from './app.js'; 
import sequelize from './config/database.js';
import dotenv from 'dotenv'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); 

console.log(process.env.DB_NAME); 

(async () => {
  try {
    await sequelize.authenticate();
    
    console.log('Database connection established successfully.');
    
    app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
    });

  } catch (error) { 
    console.error('Unable to connect to the database:', error.message); 
    console.error(error.stack)
    process.exit(1); 
  }
})();

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
