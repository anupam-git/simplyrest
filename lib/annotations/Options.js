const {Annotation} = require("nodeannotations");

class Options extends Annotation {
    constructor() {
        super("Options");
    }
}

module.exports = Options;