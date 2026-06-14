

const express=require("express");
const router =express.Router();


//index
   router.get("/", (req, res) => {
 res.send("Get for  show posts");
});

//show posts
router.get("/:id", (req, res) => {
    res.send("Get for  post id");
});
//create posts
router.post("/", (req, res) => {
   res.send("Post for create posts");
});
//delete posts
router.delete("/:id", (req, res) => {
   res.send("Delete for delete posts");
});


module.exports=router;