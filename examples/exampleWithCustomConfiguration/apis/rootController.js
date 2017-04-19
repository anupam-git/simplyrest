/**
 * @Controller("/")
 */
class RootContrtoller {
	/**
	 * @Get("/")
	 */
	rootMethod(req, res, next) {
		res.render("sample");
	}
}

module.exports = RootContrtoller;
