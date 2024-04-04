const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const upload = require('express-fileupload');
const bodyParser = require("body-parser");
const cors = require('cors');
const spawner = require('child_process').spawn;
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

dotenv.config({path : 'config.env'});

const PORT = 5000;

app.use(cors());
app.use(upload());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const region = process.env.AWS_BUCKET_REGION
const imageBucketName = process.env.AWS_IMAGE_BUCKET_NAME
const audioBucketName = process.env.AWS_AUDIO_BUCKETE_NAME 
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    region: region
});

app.post('/s3front', async (req, res) => {
    const file = req.files.file;
    const brand = req.body.brand;
    const model = req.body.model;

    const imageName = brand + "_" + model + "_" + "front";
    const params = {
        Bucket: imageBucketName,
        Key: imageName,
        Body: file.data,
        ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params);
    try{
        await s3.send(command);
        res.json({ message: 'File Uploaded Successfully' })
    }catch{
        res.json({ message: 'Error When Uploading File' })
    }
});

app.post('/s3back', async (req, res) => {
    const file = req.files.file;
    const brand = req.body.brand;
    const model = req.body.model;

    const imageName = brand + "_" + model + "_" + "back";
    const params = {
        Bucket: imageBucketName,
        Key: imageName,
        Body: file.data,
        ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params);
    try{
        await s3.send(command);
        res.json({ message: 'File Uploaded Successfully' })
    }catch{
        res.json({ message: 'Error When Uploading File' })
    }
});

app.post('/s3left', async (req, res) => {
    const file = req.files.file;
    const brand = req.body.brand;
    const model = req.body.model;

    const imageName = brand + "_" + model + "_" + "left";
    const params = {
        Bucket: imageBucketName,
        Key: imageName,
        Body: file.data,
        ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params);
    try{
        await s3.send(command);
        res.json({ message: 'File Uploaded Successfully' })
    }catch{
        res.json({ message: 'Error When Uploading File' })
    }
});

app.post('/s3right', async (req, res) => {
    const file = req.files.file;
    const brand = req.body.brand;
    const model = req.body.model;

    const imageName = brand + "_" + model + "_" + "right";
    const params = {
        Bucket: imageBucketName,
        Key: imageName,
        Body: file.data,
        ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params);
    try{
        await s3.send(command);
        res.json({ message: 'File Uploaded Successfully' })
    }catch{
        res.json({ message: 'Error When Uploading File' })
    }
});

app.post('/s3accelarate', async (req, res) => {
    const file = req.files.file;
    const brand = req.body.brand;
    const model = req.body.model;

    const audioName = brand + "_" + model + "_" + "accelarate";
    const params = {
        Bucket: audioBucketName,
        Key: audioName,
        Body: file.data,
        ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params);
    try{
        await s3.send(command);
        res.json({ message: 'File Uploaded Successfully' })
    }catch{
        res.json({ message: 'Error When Uploading File' })
    }
});

app.post('/s3deaccelarate', async (req, res) => {
    const file = req.files.file;
    const brand = req.body.brand;
    const model = req.body.model;

    const audioName = brand + "_" + model + "_" + "deaccelarate";
    const params = {
        Bucket: audioBucketName,
        Key: audioName,
        Body: file.data,
        ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params);
    try{
        await s3.send(command);
        res.json({ message: 'File Uploaded Successfully' })
    }catch{
        res.json({ message: 'Error When Uploading File' })
    }
});

app.post('/evaluateImage', async (req, res) => {
    const {brand, model} = req.body;
    const child = spawner('python', ['./Image_Audio_Comparison/Image_Comparison.py', brand, model]);

    child.stdout.on('data', (data) => {
        console.log(`stdout : ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr : ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    res.send({"message" : "Image Comparison Done Successfully"});
})

app.post('/evaluateaudio', async (req, res) => {
    const {brand, model} = req.body;
    const child = spawner('python', ['C:/Users/HarshGupta/Desktop/Tvs-Credit-It-Challenge/server/Audio_Download_Compare.py', brand, model]);

    child.stdout.on('data', (data) => {
        console.log(`stdout : ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr : ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    res.send({"message" : "python file executed successfully"});
})

app.get('/finalscore', (req, res) => {

    const child = spawner('python', ['C:/Users/HarshGupta/Desktop/Tvs-Credit-It-Challenge/server/Non_ML_Score.py']);
    
    child.stdout.on('data', (data) => {
        console.log(`stdout : ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr : ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    res.json({"message" : "run successfully"});
})

app.post('/write', (req, res) => {
    const {data} = req.body;
    fs.writeFile('C:/Users/HarshGupta/Desktop/Name.txt', data, err => {
        if(err){
          console.log(err);
          return res.send({"message" : "error occured"});
        }
    })
    res.send({"info" : "present text"});
})

app.post('/writefinalscore', (req, res) => {
    const {brand, model, oldprice, yearsold, ownership, location, kmsdriven} = req.body;
    const imagescore = fs.readFileSync('C:/Users/HarshGupta/Desktop/Images_output/out.txt', 'utf-8');
    const x = brand + ',' + model + ',' + oldprice + ',' + yearsold + ',' + ownership + ',' + location + ',' + kmsdriven + ',' + 0.5 + ',' + imagescore;

    fs.writeFile('C:/Users/HarshGupta/Desktop/outcomes/detail.txt', x, err => {
        if(err){
          console.log(err);
          return res.send({"message" : "error occured"});
        }
    })

    return res.send({"info" : "present text"});
})

app.get('/display', (req, res) => {
    fs.readFile('C:/Users/HarshGupta/Desktop/outcomes/Final_Price.txt', 'utf-8', (err, data) => {
        return res.status(201).json({"Finalscore" : data});
    });
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/getsize', async (req, res) => {

    const child = spawner('python', ['C:/Users/HarshGupta/Desktop/Tvs-Credit-It-Challenge/server/Csv_Size.py']);
    
    child.stdout.on('data', (data) => {
        console.log(`stdout : ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr : ${data}`);
    });

    await sleep(20000);

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    fs.readFile('C:/Users/HarshGupta/Desktop/size.txt', 'utf-8', (err, data) => {
        console.log(`the size of csv is, ${data}`);
        return res.status(201).json({"Size" : data});
    });
})

app.get('/mldisplay', async (req, res) => {
    const child = spawner('python', ['C:/Users/HarshGupta/Desktop/Tvs-Credit-It-Challenge/server/ML_Score.py']);
    
    child.stdout.on('data', (data) => {
        console.log(`stdout : ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr : ${data}`);
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    await sleep(15000);

    fs.readFile('C:/Users/HarshGupta/Desktop/ml_predicted.txt', 'utf-8', (err, data) => {
        return res.status(201).json({"Finalscoreml" : data});
    });
})

app.listen(5000, () =>{ 
    console.log(`server is running on port ${PORT}`);
});