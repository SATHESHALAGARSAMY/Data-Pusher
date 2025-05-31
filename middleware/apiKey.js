// Function to generate an API key
const generateApiKey = () => {
    // Generate 32 random bytes and convert them to a hexadecimal string
    return crypto.randomBytes(32).toString("hex");
  };
  
  // Generate an API key
  const apiKey = generateApiKey();
  console.log(`Generated API Key: ${apiKey}`);
  module.exports = {
    authenticateApiKey,
  };