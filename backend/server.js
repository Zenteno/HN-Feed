let express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	dbConfig = require('./database/db');
	https = require('https');

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
	useNewUrlParser: true
}).then(() => {
		console.log('Database sucessfully connected')
	},
	error => {
		console.log('Database could not connected: ' + error)
	}
)

// Setting up port with express js
const articleRoute = require('../backend/routes/article.route')
const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: false
}));

https.get('https://hn.algolia.com/api/v1/search_by_date?query=nodejs', (resp) => {
	let data = '';
	let Article = require('./models/Article');
	// A chunk of data has been recieved.
	resp.on('data', (chunk) => {
		data += chunk;
	});

	// The whole response has been received. Print out the result.
	resp.on('end', () => {
		data = JSON.parse(data);
		data["hits"].forEach(obj => {
    		const title = obj["title"] || obj["story_title"];
    		const url = obj["url"] || obj["story_url"];
    		if(title!=null && url != null){
	    		const author = obj["author"];
	    		const created_at = obj["created_at"];
	    		const article = {
	    			title: title,
	    			url : url,
	    			created_at: created_at,
	    			author :  author
	    		};
	    		Article.create(article, (error, dd) => {
					if (error) {
						return next(error)
					} else {
						console.log(dd);
					}
				})
    		}

    		
    	});

	});

}).on("error", (err) => {
	console.log("Error: " + err.message);
});

app.use(cors()); 
app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/api', articleRoute)

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
	console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	console.error(err.message); // Log error message in our server's console
	if (!err.statusCode) 
		err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
	res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});




