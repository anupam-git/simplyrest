const {Annotation} = require("nodeannotations");

class Get extends Annotation {
    constructor() {
        super("Get");
    }
}

module.exports = Get;