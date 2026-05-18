import app from './src/app.js';
import connectDB from './src/database/mongodb.js';

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    connectDB();
});