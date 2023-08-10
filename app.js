//jshint esversion:6

const express = require('express');
const app = express();
const date = require("./date.js");
const _ = require("lodash");
const mongoose = require('mongoose');
const mongoDB = "mongodb+srv://julianasogwa96:Chelsea2082@cluster0.sbtz5z1.mongodb.net/todolistDB?retryWrites=true&w=majority"

const day = date.getDate();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect(mongoDB).then((res)=>{
    console.log(res);
    console.log("Successfully connected");
}).catch((error)=>{
    console.log(error);
});

const itemSchema = new mongoose.Schema({
    name: String
});
const Item = new mongoose.model("Item",itemSchema);

const item1 = new Item({
    name:"Welcome to your to do list"
});
const item2 = new Item({
    name:"Hit + to add a new item"
});
const item3 = new Item({
    name:"Click the checkbox to delete"
});
const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});
const List = mongoose.model("List",listSchema);

// Item.insertMany(defaultItems).then(
//     console.log("Inserted successfully!")
// ).catch((error)=>{
//     console.error("Error: ",error);
// })
app.get("/",(req,res)=>{
    
    Item.find({}).exec().then((foundItems)=>{
        if(foundItems.length===0){
            Item.insertMany(defaultItems).then(
                console.log("Inserted successfully!")
            ).catch((error)=>{
                console.error("Error: ",error);
            })
            res.redirect("/");
        } else{
            res.render('index',{listTitle:day, newItems:foundItems});
        }
    }).catch((error)=>{
        console.error("Error: ",error);
    })
    
});

app.get("/about", (req,res)=>{
    res.render('about');
});
app.post("/",(req,res)=>{
    const itemName= req.body.newItem;
    const listName= req.body.list;
    const item = new Item({
        name: itemName
    });
    if(listName===day){
        item.save();
        res.redirect("/");
    } else{
        List.findOne({name:listName}).exec().then((foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        }).catch((error)=>{
            console.error("Error: ",error);
        });
    }
    
});

app.post("/delete",(req,res)=>{
    const itemID = req.body.checkbox;
    const listName = req.body.listName;

    if(listName===day){
        Item.findByIdAndRemove({_id: itemID}).exec().then((foundItem)=>{
        }).catch((error)=>{
            console.error("Error: ",error);
        });
        res.redirect("/");
    } else{
        List.findOneAndUpdate({name:listName},{$pull: {items: {_id:itemID}}}).exec()
        .then((foundList)=>{
            res.redirect("/"+listName);
        }).catch((error)=>{
            console.error("Error: ",error);
        });
    }

    
});

app.get("/:customListName",(req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName}).exec().then((foundList)=>{
        if(foundList===null){
            const list= new List({
                name: customListName,
                items: defaultItems,
            });
            list.save();
            res.redirect("/"+customListName);
        } else{
            res.render("index",{listTitle:customListName, newItems:foundList.items});
        }
    }).catch((error)=>{
        console.error("Error: ",error);
    });
    
})

app.listen(3000,()=>{
    console.log("Server is running");
})