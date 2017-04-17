/**
 * @Controller("/")
 */
class RootContrtoller {
	/**
	 * @Get("/")
	 */
	restApi2(req, res, next) {
		res.send("Welcome...");
	}
}

module.exports = RootContrtoller;
