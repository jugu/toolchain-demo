const
    express = require('express'),
    nconf = require("nconf");
const app = express();

app.set('view engine', 'pug');

/* GET home page. */
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

function populateNconfSync() {
	/* Load up configuration.
	   - ENVVARs override...
	   - Whatever's in the VCAP_SERVICES envvar (parsed as json) which overrides...
	   - config/${NODE_ENV}.json which overrides...
	   - config/dev.json.
	*/
	nconf.env("__");

	var overrides = {};

	if (process.env.VCAP_SERVICES)
		overrides._vcap_services = JSON.parse(process.env.VCAP_SERVICES);

	if (process.env.VCAP_APPLICATION)
		overrides._vcap_application = JSON.parse(process.env.VCAP_APPLICATION);

	if (Object.getOwnPropertyNames(nconf.overrides).length !== 0) {
		nconf.overrides(overrides);
	}
}

populateNconfSync();

app.listen(nconf.get("PORT"), function () {
  console.log('Example app listening on port 3000!')
})
