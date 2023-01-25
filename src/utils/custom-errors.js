const maxMessageLength = 2000;

// Error thrown when text length exceeds discord max message length
class TextExceedsMaxLength extends Error {
    constructor(message="TextExceedsMaxLength") {
        super(message);
        this.name = "TextExceedsMaxLength";
    }
}


module.exports = { maxMessageLength, TextExceedsMaxLength };
