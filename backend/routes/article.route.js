const express = require('express');
const app = express();
const articleRoute = express.Router();

// Article model
let Article = require('../models/Article');

// Add Article
articleRoute.route('/create').post((req, res, next) => {
	Article.create(req.body, (error, data) => {
		if (error) {
			return next(error)
		} else {
			res.json(data)
		}
	})
});

// Get All Articles
articleRoute.route('/').get((req, res) => {
	Article.find({ visible: true},(error, data) => {
		if (error) {
			return next(error)
		} else {
			res.json(data)
		}
	})
	.sort({ created_at: -1 })
})


// Delete article
articleRoute.route('/delete/:id').delete((req, res, next) => {
	Article.findOneAndRemove(req.params.id, (error, data) => {
		if (error) {
			return next(error);
		} else {
			res.status(200).json({
				msg: data
			})
		}
	})
})


// DeActivate article
articleRoute.route('/deactivate/:id').post((req, res, next) => {
	Article.updateOne({ _id : req.params.id },{ visible : false }, (error, data) => {
		if (error) {
			return next(error);
		} else {
			res.status(200).json({
				msg: data
			})
		}
	})
})

module.exports = articleRoute;
