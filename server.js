const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const collection=require("./mongodb")

const templatePath = path.join(__dirname,'../templates')
app.use(express.static(path.join(__dirname, '../public')));


app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    res.render("basic.hbs");
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.get("/student",(req,res)=>{
    res.render("student");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/signup",async (req,res)=>{

    const data={
        name:req.body.name,
        password:req.body.password,
        post:"student"
    }

    await collection.insertMany([data])
    res.redirect('/login?alert=' + encodeURIComponent("you have successfully signed up!! Login with your credintials"))
})

app.post("/login",async (req,res)=>{

    try {
        const user = await collection.findOne({ name: req.body.name });
        if (!user) {
            throw new Error("Username doesn't exist, Please SignUp");
        }

        if (user.password !== req.body.password) {
        throw new Error("Wrong Password");
        }

        if (user.post === "student") {
        res.render("loginpage.hbs");
        } else {
        res.render("home.hbs");
        }
    } catch (err) {
    // Redirect back to login page with alert message
    res.redirect('/login?alert=' + encodeURIComponent(err.message));
    }

})

app.listen(3000,()=>{
    console.log("port connected");
})
