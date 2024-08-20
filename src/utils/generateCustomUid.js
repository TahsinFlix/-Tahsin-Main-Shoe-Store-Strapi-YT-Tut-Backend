// Function to generate a custom UID
const generateCodUid = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let uid = '';
    
    // Generate 2 random letters
    for (let i = 0; i < 2; i++) {
      uid += letters.charAt(Math.floor(Math.random() * letters.length));
    }
  
    // Generate 4 random digits
    for (let i = 0; i < 4; i++) {
      uid += digits.charAt(Math.floor(Math.random() * digits.length));
    }
  
    return uid;
  };
  
  module.exports = {
    generateCodUid
  };
  