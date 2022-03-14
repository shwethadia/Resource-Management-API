const express = require("express");
const path = require('path');
const fs = require('fs');
const cors = require("cors");
const app = express();
const PORT = 3001;


const pathTofile = path.resolve("./data.json");
const getResources = fs.readFileSync(pathTofile);


app.use(express.json());

const corsOptions = {

    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}


app.use(cors(corsOptions));



app.get("/", (req,res)=>{
    res.send("Hello World")
})


app.get("/api/activeresource", (req,res)=>{

    const resources = JSON.parse(getResources);
    console.log(resources)
    const activeResource = resources.find(resource => resource.status === "active")
    console.log(activeResource,"***************")
    res.send(activeResource);
})


app.get("/api/resources", (req,res)=>{

    const stringifyData = JSON.parse(getResources);
    res.send(stringifyData);
})


app.get("/api/resources/:id", (req,res)=>{

    const id = req.params.id; //const { id } = req.params;
    const resources = JSON.parse(getResources);
    const resource = resources.find((resource) => resource.id === id);
    res.send(resource);

})


app.patch("/api/resources/:id", (req,res)=>{

    const id = req.params.id; //const { id } = req.params;
    const resources = JSON.parse(getResources);
    const Index = resources.findIndex((resource) => resource.id === id);
    console.log(req.body)
    const activeResource = resources.find(resource => resource.status === "active");
    console.log(activeResource);

    if (resources[Index].status === "complete"){

        return res.status(422).send("Cannot Update completed resource")
    }
    resources[Index] = req.body;

    //active resource related functionality
    console.log(resources[Index])
    if(req.body.status === "active") {

        if(activeResource){

            return res.status(422).send("There is active resource already activated")
        }
        resources[Index].status = "active";
        resources[Index].activationTime = new Date();

    }
    fs.writeFile(pathTofile, JSON.stringify(resources, null, 2), (error)=>{
        if(error){
            return res.status(422).send("Cannot store data in the file");
        }
        return res.send("Data has been updated")
    })

})


app.post("/api/resources",(req,res)=>{

    const resource = req.body;
    resource.createdAt = new Date();
    resource.status = "inactive";
    resource.id = Date.now().toString();
    const resources =  JSON.parse(getResources);
    resources.unshift(resource)
    fs.writeFile(pathTofile, JSON.stringify(resources, null, 2), (error)=>{
        if(error){
            return res.status(422).send("Cannot store data in the file");
        }

        return res.send("Data has been saved")
    })
    
})



app.listen(PORT,()=>{

    console.log("App is listening on port:" + PORT);

})