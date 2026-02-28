# Database Setup Guide

## MongoDB Atlas (Cloud - Recommended)

1. **Sign up for MongoDB Atlas:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Create a new project and cluster (free tier)

2. **Get your connection string:**
   - In MongoDB Atlas, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` with your actual values

3. **Update `.env.local`:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mazim-travels?retryWrites=true&w=majority
   ```

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## Local MongoDB (for development)

If you want to use MongoDB locally:

1. **Install MongoDB Community:**
   - Linux: `sudo apt-get install mongodb`
   - macOS: `brew install mongodb-community`
   - Windows: Download from https://www.mongodb.com/try/download/community

2. **Start MongoDB service:**
   - Linux/macOS: `mongod`
   - Windows: MongoDB runs as a service automatically

3. **Use the default connection string in `.env.local`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/mazim-travels
   ```

4. **Restart your dev server**

## Troubleshooting

- **"Failed to connect to MongoDB"**: Check your connection string and ensure MongoDB is running
- **"Authentication failed"**: Verify your MongoDB Atlas username and password
- **"Whitelist your connection IP"**: In MongoDB Atlas, add your IP to the Network Access list
