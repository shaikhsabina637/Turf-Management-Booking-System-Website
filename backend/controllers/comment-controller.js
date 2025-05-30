const mongoose = require("mongoose");
const User = require("../models/user");
const Comment = require("../models/comment");
const Turf = require("../models/turf");
const Rating = require("../models/rating");
const UserActivity = require("../models/userActivity");
const FeedBack = require("../models/feedBack");
exports.createComment =async(req,res)=>{
   try{
    const {commentText} = req.body;
    const {turfId,userId} = req.params;
    if(!commentText || !turfId || !userId){
        return res.status(404).json({
            success:false,
            message:"Please Provide the Fields Properly!"
        })
    }
    const turfExits = await Turf.findById(turfId);
    const userExits = await User.findById(userId);
    if(!userExits){
        return res.status(404).json({
            status:false,
            message:"No User Founds!"
        })
    }
    if(!turfExits){
        return res.status(404).json({
            status:false,
            message:"No Turf Found!"
        })
    }
    const newComment = await Comment.create({
        commentText,
        userId,
        turfId,
    })
    const populatedComment = await Comment.findById(newComment._id).populate("userId");

    turfExits.comments.push(populatedComment._id);
    await turfExits.save();
    console.log("turfexits",turfExits)
    return res.status(200).json({
        success:true,
        message:"Comment Created Successfully!",
        populatedComment,
    })

   }catch(error){
    console.log("error",error);
    return res.status(500).json({
         success:false,
         message:" Error  While Comment Creating!",
         error:error.message

    })
   }
}
exports.updateComment =async(req,res)=>{
  try{
    const {commentId,commentText} = req.body;
    const {turfId,userId} = req.params;
    if(!commentId || !commentText){
        return res.status(404).json({
            success:false,
            message:"Please Provide The Fields!"
        })
    }
    const commentExits = await Comment.findById(commentId);
    if(!commentExits){
        return res.status(404).json({
            success:false,
            message:"Could n't find the particular Comment Id"
        })
    }
    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        commentText
    },{new:true})
    return res.status(200).json({
        success:true,
        message:"Updated The Comment!",
        updatedComment
    })
  }catch(error){
    console.log("error",error);
    return res.status(500).json({
         success:false,
         message:" Error  While Updating Comment !",
         error:error.message

    })
  }
}
exports.deleteComments =async(req,res)=>{
try{
  const {turfId,userId,commentId}= req.params;
  if(!commentId ||!turfId ||!userId){
    return res.status(404).json({
        success:false,
        message:"No Comment Found By This Id!"
    })
  }
  const commentDelete = await Comment.findByIdAndDelete(commentId);
  return res.status(200).json({
    success:true,
    message:"Delete The Comment!",
    commentDelete
})
}catch(error){
    console.log("error",error);
    return res.status(500).json({
         success:false,
         message:" Error  While Comment Deleting!",
         error:error.message

    })
}
}

exports.addRating= async (req, res) => {
  try {
    const { value,userId,turfId} = req.body;

    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: "Turf not found" });
    const newRating = new Rating({
       rating:value,
       user:userId,
      turf: turfId,
    });

    await newRating.save();

    turf.ratings.push(newRating._id);
    await turf.save();

    res.json({ success: true, message: "Rating added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error });
  }
};

exports.createCommentWithRating = async (req, res) => {
  try {
    const { commentText, ratingValue } = req.body;
    const userId = req.params.userId;
    const turfId = req.params.turfId;
    const newRating = new Rating({
      user: userId,
      turf: turfId,
      rating: ratingValue,
    });
    const savedRating = await newRating.save();
    const newComment = new Comment({
      userId: userId,
      turfId: turfId,
      commentText: commentText,
      rating: savedRating._id,
    })

    await newComment.save();
  const turf = await Turf.findById(turfId);
   turf.comments.push(newComment._id);
   const fetchTurfById = await turf.save();
  const user = await User.findById(userId);
  const activity = await UserActivity.create({
    userId:user._id,
    action:"Give Comment And Rating!"
});
await user.recentActivity.push(activity._id);
await user.save();
    res.status(201).json({
      success: true,
      message: "Comment and Rating saved successfully!",
      fetchTurfById,
    });
  } catch (error) {
    console.log("error",error)
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCommentsWithRatings = async (req, res) => {
  try {
    const turfId = req.params.turfId;
    const comments = await Comment.find({ turfId: turfId })
      .populate("userId", "firstName lastName email image")
      .populate("rating", "rating"); 

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCommentWithTestimonals = async (req,res)=>{
  try{
     const testimonals = await Comment.find({})
     .populate({
      path:"userId",
      select:"firstName lastName image email"
     })
     .populate({
      path:"rating",
      select:"rating"
     })
     .populate({
      path:"turfId",
      select:"turfName"
     })
     return res.status(200).json({
      success:true,
      message:"Comment fetch!",
      testimonals,
     })
  }catch(error){
       console.log("error",error);
       return res.status(500).json({
        success:false,
        message:"Error while fetching Testimonals",
        error:error.message
       })
  }
}
exports.displayFeedback = async(req,res)=>{
  try{
    // get all the feedback 
    const feedBack = await FeedBack.findOne().populate("user").sort({createdAt:-1})
    // validate if there is no feedback
    if(!feedBack) {
      return res.status(404).json({
        success:false,
        message:"No Feedback Found!"
      })
    }
    // return the response
    return res.status(200).json({
      success:true,
      message:"Found The Feedback",
      feedBack
    })
  }catch(error){
    console.log("error",error)
    return res.status(500).json({
      success:false,
      message:"Error while fetching Feedback",
      error:error.message,
    })
  }
}

