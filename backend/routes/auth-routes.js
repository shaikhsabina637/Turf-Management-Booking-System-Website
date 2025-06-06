const{auth,isAdmin,isUser} = require("../middlewares/auth-middleware");
// importing the authentication controller
const {signup,login,changePassword, sendOtp, verifyOtp, forgetPassword, resetPassword, contactMe, deleteProfile, uploadProfileImage,updateProfile, subscription, fetchAllUsers} = require("../controllers/auth-controller");
const express= require("express");
const router = express.Router();
// routing the path
// authentication routes
router.post("/signup",signup);
router.post("/login",login);
router.post("/changePassword",auth,isUser,changePassword);
router.post("/sendOtp",sendOtp);
router.post("/verifyOtp",verifyOtp);
router.post("/forgetPassword",forgetPassword);
router.post("/resetPassword",resetPassword);
router.post("/contactMe",contactMe);
router.delete("/deleteProfile/:id",auth,deleteProfile);
router.post("/updateProfile/:id", auth,updateProfile);
router.post("/upload-Profile-Image/:id",uploadProfileImage);
router.post("/subscription",subscription);
router.get("/fetchAllUsers",auth,fetchAllUsers);

// protected routes 
router.get("/admin",auth,isAdmin,(req,res)=>{
    return res.status(200).json({
        status:true,
        message:"welcome to protected routes of admin"
    })
});
router.get("/user",auth,isUser,(req,res)=>{
    return res.status(200).json({
        status:true,
        message:"welcome to protected routes of player!"
    })
});
module.exports = router;