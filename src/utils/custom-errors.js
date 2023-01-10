// Error thrown when text length exceeds the following value
const maxMessageLength = 2000;
// Custom error class for when text exceeds the maximum length
class TextExceedsMaxLength extends Error {
    // Constructor for TextExceedsMaxLength error class
    // Accepts a message parameter
    constructor(message="TextExceedsMaxLength") {
        // Call the parent Error class constructor with the provided message
        super(message);
        // Set the name property of this error class
        this.name = "TextExceedsMaxLength";
    }
}

// Export the custom error classes
module.exports = { maxMessageLength, TextExceedsMaxLength };
