# MongoDB Atlas Setup Guide

Follow these steps to set up your free MongoDB database:

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** (or Sign In if you have an account)
3. Complete the registration with your email

## Step 2: Create a Cluster
1. After logging in, click **"Create"** to build a new cluster
2. Choose the **"Free"** tier (M0 - Free)
3. Select your preferred region (closer to you is better)
4. Click **"Create Deployment"**
5. Wait for the cluster to be created (2-3 minutes)

## Step 3: Set Up Database Access
1. In the left sidebar, go to **Security → Database Access**
2. Click **"Add New Database User"**
3. Choose **Username/Password** authentication
4. Enter:
   - Username: `vohra_user`
   - Password: Create a strong password (save this!)
   - Click **"Add User"**

## Step 4: Configure Network Access
1. Go to **Security → Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add your IP)
4. Click **"Confirm"**

## Step 5: Get Your Connection String
1. Go back to **Databases** (top left)
2. Click the **"Connect"** button on your cluster
3. Select **"Drivers"**
4. Choose **Node.js** and version **4.1 or later**
5. Copy the connection string that looks like:
   ```
   mongodb+srv://vohra_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File
Replace `<password>` in the connection string with your actual password and add it to your `.env` file:

```
MONGODB_URI=mongodb+srv://vohra_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/vohra_ca?retryWrites=true&w=majority
```

## Step 7: Restart the Server
Once you've added the MongoDB URI to your `.env` file, restart your backend server and test the app!

---

**Questions?** MongoDB Atlas is free and very reliable. The setup takes ~5 minutes!
