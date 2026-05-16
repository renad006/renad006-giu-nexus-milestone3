const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
title:{
    type:String,
    required:true
},
company:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
requirements:{
    type:[String],
    required:false,     
},
location:{
    type:String,
    required:true
},
type:{
    type:String,
    enum:["full-time","part-time","internship"],
    required:true
},
salary:{
    type:Number,
    required:false,
    min:0
},
category: {
  type: String,
  enum: [
    "Frontend",
    "Backend",
    "AI/ML",
    "DevOps",
    "Data Engineering",
    "Other"
  ],
  required: false,
  default: "Other"
},
totalSlots:{
    type:Number,
    required:false,       
    min:1,
    default: 1
},
status:{
    type:String,
    enum:["open","closed"],
    required:false,      
    default: "open" 
},
createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}],
},
{
    timestamps:true
}
);

const JobPost = mongoose.model("JobPost", jobPostSchema);
module.exports = JobPost;