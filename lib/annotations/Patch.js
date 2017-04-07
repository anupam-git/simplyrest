const {Annotation} = require("nodeannotations");

class Patch extends Annotation {
    constructor() {
        super("Patch");
    }
}

module.exports = Patch;