import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
floor: {
type: Number,
required: true,
},
date: {
type: String,
required: true,
},
name: {
type: String,
required: true,
},
production: {
type: Number,
required: true,
},
alter: {
type: Number,
required: true,
},
percentage: {
type: Number,
required: true,
},
});

const Alter = mongoose.models.Data || mongoose.model('Data', DataSchema);

export default Alter;