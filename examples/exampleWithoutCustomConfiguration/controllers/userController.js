/**
 * @Controller("User/")
 */
class UserContrtoller {
	/**
	 * @Get("print/myname/:name")
	 */
	printMyName(req, res, next) {
		res.send("My Name is : "+req.params.name);
	}
}

module.exports = UserContrtoller;
