class UserNotUPDated extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserNotUPDated';
    }
}

module.exports = UserNotUPDated;