const {Annotation} = require("nodeannotations");

class Connect extends Annotation {
    constructor() {
        super("Connect");
    }
}

module.exports = Connect;