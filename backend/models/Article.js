const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Article = new Schema({
   objectId: {
      type: Number
   },
   title: {
      type: String
   },
   author: {
      type: String
   },
   created_at: {
      type: Date
   },
   url: {
      type: String
   },
   visible: {
   		type: Boolean
   },
}, {
   collection: 'articles'
})

module.exports = mongoose.model('Article', Article)