const {Annotation} = require("nodeannotations");

class Controller extends Annotation {
    constructor() {
        super("Controller");
    }
}

module.exports = Controller;