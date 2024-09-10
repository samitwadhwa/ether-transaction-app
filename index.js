const express = require('express');
require('dotenv').config();
const depositRoutes = require('./routes/depositTransactionRoute');

const app = express();
app.use(express.json());

//connect db
require("./config/db").connect();

//routes
app.use('/api/v1', depositRoutes);
app.use('/',(req,res)=>{
res.send('ETH DEPOSIT TRACKER ON SEPOLIA')
})  

//connect to the port and start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
