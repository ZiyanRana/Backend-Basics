import app from './src/app.js';
import connectDB from './src/database/mongodb.js';
import { PORT, NODE_ENV } from './src/config/env.js';

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    connectDB();
});