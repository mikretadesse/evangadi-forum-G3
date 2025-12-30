import dotenv from "dotenv";
import app from "./app.js";
dotenv.config(); 


// /  Start server
const PORT = process.env.PORT ||4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});