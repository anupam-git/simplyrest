const {Annotation} = require("nodeannotations");

class Trace extends Annotation {
    constructor() {
        super("Trace");
    }
}

module.exports = Trace;