const express= require("express");
const {isUser,auth} = require("../middlewares/auth-middleware");
const { createComment, updateComment, deleteComments,addRating, createCommentWithRating, getCommentsWithRatings, getCommentWithTestimonals,displayFeedback } = require("../controllers/comment-controller");
const router = express.Router();

router.post("/createComment/:turfId/:userId",auth,isUser,createComment);
router.post("/updateComment/:turfId/:userId",auth,isUser,updateComment);
router.delete("/deleteComment/:turfId/:userId/:commentId",auth,isUser,deleteComments);
router.post("/addRating",auth,isUser,addRating);
router.post("/createCommentWithRating/:userId/:turfId",auth,isUser,createCommentWithRating);
router.get("/getCommentWithRating/:turfId",getCommentsWithRatings);
router.get("/getCommentWithTestimonals",getCommentWithTestimonals);
router.get("/displayFeedBack",displayFeedback);
module.exports = router;