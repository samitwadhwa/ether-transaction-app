// Import necessary libraries
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Your Etherscan API Key from the environment variable
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const transactionHash = '0x899e4d191574bddaf68464e835cfeabbf5730a66986f07ee8bd64700e3b475b7'; // Replace with an actual Sepolia transaction hash

// MongoDB Connection URL from your .env file
const mongoUri = process.env.MONGO_URL;

// MongoDB connection
async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoUri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

// Define a Transaction Schema
const transactionSchema = new mongoose.Schema({
    blockHash: String,
    blockNumber: Number,
    from: String,
    gas: String,
    gasPrice: String,
    hash: String,
    input: String,
    nonce: Number,
    to: String,
    transactionIndex: Number,
    value: String,
    v: String,
    r: String,
    s: String,
    timestamp: { type: Date, default: Date.now }
});

// Create a Mongoose model
const Transaction = mongoose.model('Transaction', transactionSchema);

// Fetch transaction details from Sepolia network
async function getTransactionDetails(txHash) {
    try {
        const url = `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${etherscanApiKey}`;
        
        // Make API request to Etherscan for Sepolia network
        const response = await axios.get(url);
        
        if (response.data.result) {
            console.log("Transaction Details:", response.data.result);
            await saveTransactionToDB(response.data.result);
        } else {
            console.log("No transaction details found for the given hash.");
        }
    } catch (error) {
        console.error("Error fetching transaction details:", error.message);
    }
}

// Save transaction details to MongoDB
async function saveTransactionToDB(transactionData) {
    try {
        const newTransaction = new Transaction(transactionData);
        await newTransaction.save();
        console.log("Transaction saved to DB");
        await keepLatestFiveTransactions(); // Call the function to keep only the latest 5
    } catch (error) {
        console.error("Error saving transaction to DB:", error.message);
    }
}

// Function to keep only the latest 5 transactions
async function keepLatestFiveTransactions() {
    try {
        const totalTransactions = await Transaction.countDocuments();
        
        // If there are more than 5 transactions, delete the older ones
        if (totalTransactions > 5) {
            const oldestTransactions = await Transaction.find().sort({ timestamp: 1 }).limit(totalTransactions - 5);
            const deleteIds = oldestTransactions.map(tx => tx._id);
            await Transaction.deleteMany({ _id: { $in: deleteIds } });
            console.log(`Deleted ${deleteIds.length} old transactions, keeping only the latest 5.`);
        }
    } catch (error) {
        console.error("Error managing the number of transactions in DB:", error.message);
    }
}

// Main function to connect to MongoDB and fetch transaction details
async function main() {
    await connectToMongoDB();
    await getTransactionDetails(transactionHash);
}

main();
