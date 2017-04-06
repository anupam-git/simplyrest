const {Annotation} = require("nodeannotations");

class Post extends Annotation {
    constructor() {
        super("Post");
    }
}

module.exports = Post;