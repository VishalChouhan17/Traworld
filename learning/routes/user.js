
 

const express=require("express");
const router =express.Router();


//index
   router.get("/", (req, res) => {
 res.send("Get for  show users");
});
//show users
router.get("/:id", (req, res) => {
 res.send("Get for  user id");
});
//create users
router.post("/", (req, res) => {
   res.send("Post for create users");
});
//delete users
router.delete("/:id", (req, res) => {
   res.send("Delete for delete users");
});

module.exports=router;