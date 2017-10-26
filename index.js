const
    express = require('express'),
    nconf = require("nconf"),
    i18n = require("i18n");
const app = express();

i18n.configure({
    locales:['en', 'de'],
    directory: __dirname + '/locales',
    prefix: 'resources_'
});
app.set('view engine', 'pug');

app.use(i18n.init);
/* GET home page. */
app.get('/', function (req, res) {
  loadData(req, res, "en")
})
app.get('/de', function(req, res){
  loadData(req, res, "de")
});
app.get('/es', function(req, res){
  loadData(req, res, "es")
});
app.get('/ja', function(req, res){
  loadData(req, res, "ja")
});

function loadData(req, res, locale) {
  i18n.setLocale(locale);
  var data =  {
    selectlocale: "select a locale",
    locales: ["en", "de"],
    title: 'Translation Demo',
    message: i18n.__('Hello'),
    kvlist: [i18n.__('A'), i18n.__('B'), i18n.__('C')]
  }
  res.render('index', data);
}

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

  nconf.file("default", "config/dev.json");
	if (Object.getOwnPropertyNames(nconf.overrides).length !== 0) {
		nconf.overrides(overrides);
	}
}

populateNconfSync();

app.listen(nconf.get("PORT"), function () {
  console.log('Example app listening on port ', nconf.get("PORT"))
})
