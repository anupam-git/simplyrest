const {Annotation} = require("nodeannotations");

class Param extends Annotation {
    constructor() {
        super("Param");
    }
}

module.exports = Param;