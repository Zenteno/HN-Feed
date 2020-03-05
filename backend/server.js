let express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	dbConfig = require('./database/db');
	https = require('https');
	cron = require('node-cron');

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
const articleRoute = require('./routes/article.route')
const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})
app.use(express.static(path.join(__dirname, 'dist/app')));
app.use('/', express.static(path.join(__dirname, 'dist/app')));
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
const cronJob = function(){
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
		data["hits"].sort((a,b) => new Date(b["created_at"]).getTime() - new Date(a["created_at"]).getTime());
		// I look for the newest element inserted
		Article.findOne({}).sort({ created_at : 'desc'}).exec((err, artcle)=>{ 
			const newest = artcle;
			let newest_date = null;
			if(newest!=null)
				newest_date = new Date(newest["created_at"]);
			for(var i in data["hits"]){
	    		const obj = data["hits"][i];
	    		const title = obj["title"] || obj["story_title"];
	    		const url = obj["url"] || obj["story_url"];
	    		const object_id = parseInt(obj["objectID"]);
	    		if(title!=null && url != null){
		    		const author = obj["author"];
		    		const created_at = obj["created_at"];

		    		const article = {
		    			title: title,
		    			url : url,
		    			created_at: created_at,
		    			author :  author,
		    			objectId: object_id,
		    			visible : true,
		    		};
		    		//if the list from the served returns me an element older than the newest element
		    		// I stop searching
		    		if(newest_date!=null && newest_date >= new Date(created_at))
		    			break;
		    		// if in the list is the newest element, I stop searching
		    		if(newest_date!=null && newest["objectId"] == object_id)
		    			break;

		    		// if I reach this point, the article does not exists in the database
		    		Article.create(article, (error, dd) => {
						if (error) {
							return next(error)
						}else{
							console.info("Post created");
						}
					});
		    		
	    		}	
    		}
		});
    	
	});

	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
};
cron.schedule('0 * * * *', cronJob);
cronJob();