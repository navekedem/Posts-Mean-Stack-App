const jwt = require("jsonwebtoken")

module.exports = (req,res,next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token ,"Nave-The_King-Secret");
    next();
  }catch(error) {
    res.status(401).json({
      message: "Auth Failed"
    });
  }

}
