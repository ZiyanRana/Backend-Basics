import app from "./src/app.js";
import { PORT, NODE_ENV } from "./src/config/env.js";

app.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});