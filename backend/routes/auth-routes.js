const{auth,isAdmin,isUser} = require("../middlewares/auth-middleware");
// importing the authentication controller
const {signup,login,changePassword, sendOtp, verifyOtp, forgetPassword,} = require("../controllers/auth-controller");
const express= require("express");
const router = express.Router();
// routing the path
// authentication routes
router.post("/signup",signup);
router.post("/login",login);
router.post("/changePassword",auth,isUser,changePassword);
router.post("/sendOtp",auth,isUser,isAdmin,sendOtp);
router.post("/verifyOtp",auth,isUser,verifyOtp);
router.post("/forgetPassword",auth,isUser,forgetPassword);

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