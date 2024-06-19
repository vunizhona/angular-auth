const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  quotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quote'}],
})

module.exports = mongoose.model('User', userSchema);
