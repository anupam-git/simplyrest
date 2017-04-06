const {Annotation} = require("nodeannotations");

class Delete extends Annotation {
    constructor() {
        super("Delete");
    }
}

module.exports = Delete;