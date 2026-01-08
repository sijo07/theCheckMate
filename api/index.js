import app from '../backend/app.js';
import connectDB from '../backend/config/db.js';

// Initialize DB connection
// In serverless, we generally want to cache this connection if possible,
// but mongoose.connect handles buffering/caching internally.
connectDB();

export default app;
