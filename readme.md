# **Ethereum Deposit Tracker on Sepolia Testnet**

### Description
This project tracks Ethereum deposit transactions on the Sepolia testnet. It provides real-time alerts for each transaction via a telegram bot, fetches transaction details using the Etherscan API, and visualizes the transactions using Grafana.

---

### Table of Contents
1. [Installation](#installation)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Environment Setup](#environment-setup)
5. [Usage](#usage)
6. [Grafana Setup](#grafana-setup)
7. [Dockerization](#dockerization)
8. [Contributing](#contributing)
9. [License](#license)

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/eth-deposit-tracker.git
   cd eth-deposit-tracker
2. **Install dependencies**:
    for this i have dockerized the app
    you can build -> docker build -t eth-deposit-tracker .
    then run the docker -> docker run -d -p 8000:8000 --env-file .env eth-deposit-tracker
3. **Create Env Variables**:
    PORT=4000
    ETHERSCAN_API_KEY=your_etherscan_api_key
    BOT_API_KEY=your_bot_api_key and more like that

### Features

1. **Ethereum Transaction Tracker**
    Tracks Ethereum transactions on the Sepolia testnet.
2. **Real time Alerts**
    Sends real-time notifications using a bot for each deposit transaction.
3. **Transaction Details**
    Fetches and logs detailed transaction data from the Etherscan API using tracker.js
4. **Grafana Integration**
    Visualizes transaction data using Grafana for real-time monitoring.

### Technologies Used

1. **Node.js**
    Backend Server
2. **Express.js**
    Web framework for the API.
3. **Etherscan API**
    Fetches Ethereum transaction details.
4. **Grafana**
    Visualizes transaction data using Grafana for real-time monitoring.
5. **Docker**
    Containerization for the application.
6. **Sepolia Testnet**
    Ethereum test network for sending/receiving transactions.

### Environment Setup

1. **Etherscan API Key**
    You'll need to get an API key from Etherscan.
2. **Bot API Key**
    If you are using a bot for transaction alerts, ensure that you have a valid API key.

### Usage

1. **Transaction Tracking**
    The application tracks incoming transactions on the Sepolia network and sends alerts for each new deposit.
2. **Transaction Details**
    The transaction details, such as sender, receiver, and value, are fetched using tracker.js with the Etherscan API.
3. **Bot Alerts**
    A bot sends real-time alerts with transaction information for each deposit detected.

### Grafana Setup

1. **Install Grafana**
    Follow the official Grafana installation guide for your system.
2. **Configure Data Source**
    Set up your data source in Grafana (can be a time-series database like Prometheus).
3. **Visualize Transactions:**
    Configure Grafana to visualize Ethereum transaction data coming from your tracker.

### Contributing

Feel free to fork this project, open issues, or submit pull requests to contribute.

