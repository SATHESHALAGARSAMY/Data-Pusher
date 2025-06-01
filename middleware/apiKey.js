const crypto = require("crypto");
const db = require("../db");

// Function to generate an API key
const generateApiKey = () => {
    // Generate 32 random bytes and convert them to a hexadecimal string
    return crypto.randomBytes(32).toString("hex");
  };
  
  // Generate an API key
  const apiKey = generateApiKey();
  console.log(`Generated API Key: ${apiKey}`);

const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.header("x-api-key");
    if (!apiKey) {
      return res
        .status(403)
        .json({ message: "Access denied, no API key provided" });
    }
    const api_user_details =
      "SELECT account_id,email,account_name,website,app_secret_token, r_status_code FROM accounts WHERE app_secret_token = ? AND status = 'Y'";
  
    let api_key_data = await db.get(api_user_details, [apiKey]);
    if (api_key_data.length === 0) {
        return res.status(401).json({ code: 401, message: "Invalid API key" });
    }
    if(api_key_data.length > 0 && api_key_data?.[0]?.status != 'Y'){
      return res.json({ 
        code: 401, 
        success: false, 
        message: "Account Deactivated" 
      });
    }
    req.body.user_info = {
      account_id: api_key_data[0].account_id,
      email: api_key_data[0].email,
      account_name: api_key_data[0].account_name,
      website: api_key_data[0].website,
    }; // Add user info to request
        next();
  };
  module.exports = {
    authenticateApiKey,
    generateApiKey
  };
