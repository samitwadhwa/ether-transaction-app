const axios = require("axios");
const Deposit = require("../model/depositSchema");

// Helper function to get block timestamps
const getBlockTime = async (blockNumber) => {
  const url = process.env.ETH_RPC_URL;

  try {
    const response = await axios.post(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBlockByNumber",
      params: [blockNumber, false], 
    });

    const blockData = response.data.result;
    return blockData ? parseInt(blockData.timestamp, 16) * 1000 : null; 
  } catch (error) {
    console.error("Error in fetching block data: ", error);
    return null;
  }
};

const Transaction = require('../model/depositSchema'); // Replace with your actual model

// Handle GET request to fetch transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find(); // Fetch all transactions
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};



// Helper function to send Telegram notification
const sendTelegramNotifications = async (message) => {
  const botToken = process.env.TELEGRAM_NOTIFICATIONS_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NOTIFICATIONS_CHAT_ID;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
    });
  } catch (error) {
    console.error("Error in sending Telegram notifications: ", error);
  }
};

// Controller function to handle deposit data
const handleDataOnDeposit = async (req, res) => {
  try {
    const { event } = req.body;

    // Check if event.activity exists
    if (!event || !event.activity) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const activities = event.activity;
    console.log("Received activity data: ", activities);

    for (const activity of activities) {
      console.log("Processing deposit data: ", activity);

      // Convert blockNum from hex to number
      const blockNumberHex = activity.blockNum;
      const blockNumber = `0x${parseInt(blockNumberHex, 16).toString(16)}`;

      // Get block timestamp
      const blockTimestamp = await getBlockTime(blockNumber);

      const depositData = {
        blockNumber: parseInt(blockNumberHex, 16),
        blockTimestamp: blockTimestamp ? new Date(blockTimestamp) : null,
        fee: activity.value,
        hash: activity.hash,
        pubkey: activity.fromAddress,
        network: "sepolia",
      };

      // Check if the transaction with the same hash already exists in the DB --> No extra storage in Database
      const existingDepositDataHash = await Deposit.findOne({ hash: depositData.hash });

      if (existingDepositDataHash) {
        console.log(
          `Deposit ${depositData.hash} already exists in the database, skipping.`
        );
        continue; 
      }

      
      const deposit = new Deposit(depositData);

      await deposit.save();
      console.log(`Deposit ${depositData.hash} saved to the database.`);

      // Send Telegram notification
      const message = `New deposit detected:\n\nHash: ${depositData.hash}\nBlock Number: ${depositData.blockNumber}\nFee: ${depositData.fee}\nTimestamp: ${depositData.blockTimestamp}`;
      await sendTelegramNotifications(message);
    }

    // Respond with success
    res.status(201).json({ message: "Deposit data stored successfully" });
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleDataOnDeposit,
  getTransactions
};
