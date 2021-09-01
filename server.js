const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
const ShortUrl = require('./models/shortUrl');
var geoip = require('geoip-lite');
const app = express();


mongoose.connect('mongodb://localhost/testingUrlShortner', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// setting ejs as view engine..
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.urlencoded({
	extended: true
}));

app.get('/', async (req, res) => {
	const shortUrls = await ShortUrl.find().sort({
		"clicks": -1
	});

	var labels = [];
	var data = [];
	var randomColor = ['rgb(255, 99, 132)',
		'rgb(54, 162, 235)',
		'rgb(255, 205, 86)',
		'rgb(225, 90, 32)',
		'rgb(54, 12, 25)',
		'rgb(55, 225, 6)',
		'rgb(215, 5, 86)',
		'rgb(225, 90, 32)',
		'rgb(54, 2, 25)',
	];
	var backgroundcolor = [];

	shortUrls.forEach((ele) => {
		labels.push(ele.short);
		data.push(ele.clicks);
		var rndIndx = (Math.ceil(Math.random() * 100)) % randomColor.length;
		backgroundcolor.push(randomColor[rndIndx]);

	});
	console.log(labels);
	console.log(data);

	res.render('index', {
		shortUrls: shortUrls,
		data: data,
		labels: labels,
		backgroundcolor: backgroundcolor,
	});
});

app.post('/shortUrls', async (req, res) => {

	console.log('Headers: ' + JSON.stringify(req.headers));
	console.log('IP: ' + JSON.stringify(req.ip));

	const isAvailable = await ShortUrl.findOne({
		short: req.params.shortUrl
	});

	//getting region of request

	var geo = geoip.lookup(req.ip);


	var country = (geo ? geo.country : "Location not detected");

	await ShortUrl.create({

		full: req.body.fullUrl,
		region: country,
	});
	res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {

	console.log(req.params);
	const shortUrl = await ShortUrl.findOne({
		short: req.params.shortUrl
	});

	if (shortUrl == null) {
		console.log('Not Find');
		return res.sendStatus(404);
	}
	shortUrl.clicks++;
	shortUrl.save();
	res.redirect(shortUrl.full);
	res.redirect("back");
});

app.listen(process.env.PORT || 5000);