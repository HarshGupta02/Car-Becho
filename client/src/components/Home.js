import React, {useState, useEffect} from 'react';
import "./Home.css";

const Home = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [oldprice, setOldprice] = useState('');
  const [oldyears, setOldyear] = useState('');
  const [ownership, setOwnership] = useState('');
  const [location, setLocation] = useState('');
  const [kms, setKms] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [accelarate, setAccelarate] = useState('');
  const [deaccelarate, setDeaccelarate] = useState('');

  const uploadFront = async (e) => {
    e.preventDefault();
    const ImageInput1 = document.querySelector("#inpFile1")
    const file1 = ImageInput1.files[0]

    const {urlfront} = await fetch('http://localhost:5000/s3front', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json());

    // const {urlfront} = await fetch('http://localhost:5000/s3front', {
    //   method : "post",
    //   headers : {
    //     "Content-Type" : "application/json"
    //   },
    //   body : JSON.stringify({
    //     brand : brand,
    //     model : model
    //   })
    // });

    console.log(urlfront);
    
    await fetch(urlfront, {
      method: "PUT",
      headers: {
        "Content-Type" : "multipart/form-data",
      },
      body: file1
    })
    
    alert("Front File Uploaded");
    
  }

  const uploadBack = async (e) => {
    e.preventDefault();
    const ImageInput2 = document.querySelector("#inpFile2");
    const file2 = ImageInput2.files[0];
    const {urlback} = await fetch('http://localhost:5000/s3back', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json())
    
    await fetch(urlback, {
      method: "PUT",
      headers: {
        "Content-Type" : "multipart/form-data"
      },
      body: file2
    })
    
    alert("Back File Uploaded");
  }
  
  const uploadLeft = async (e) => {
    e.preventDefault();
    const ImageInput3 = document.querySelector("#inpFile3");
    const file3 = ImageInput3.files[0];
    const {urlleft} = await fetch('http://localhost:5000/s3left', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json())

    await fetch(urlleft, {
      method: "PUT",
      headers: {
        "Content-Type" : "multipart/form-data"
      },
      body: file3
    })
    alert("Left File Uploaded");
  }
  
  const uploadRight = async (e) => {
    e.preventDefault();
    const ImageInput4 = document.querySelector("#inpFile4");
    const file4 = ImageInput4.files[0];
    const {urlright} = await fetch('http://localhost:5000/s3right', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json())

    console.log(urlright);
    
    await fetch(urlright, {
      method: "PUT",
      headers: {
        "Content-Type" : "multipart/form-data"
      },
      body: file4
    })
    alert("Right File Uploaded");
  }
  
  const evaluate = async (e) => {
    e.preventDefault();
    const {result} = await fetch('http://localhost:5000/evaluate', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json())
  }

  const uploadAccelarate = async (e) => {
    e.preventDefault();
    const AudioInput5 = document.querySelector("#inpFile5")
    const file5 = AudioInput5.files[0]

    const {urlaccelarate} = await fetch('http://localhost:5000/s3accelarate', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json())

    // const {urlaccelarate} = await fetch('http://localhost:5000/s3accelarate').then(res => res.json());

    // console.log(urlaccelarate);
    
    await fetch(urlaccelarate, {
      method: "PUT",
      headers: {
        "Content-Type" : "multipart/form-data",
      },
      body: file5
    })
    
    alert("Accelarating Audio Uploaded");
  }

  const uploadDeaccelarate = async (e) => {
    e.preventDefault();
    const AudioInput6 = document.querySelector("#inpFile6")
    const file6 = AudioInput6.files[0]

    // const {urldeaccelarate} = await fetch('http://localhost:5000/s3deaccelarate').then(res => res.json());

    const {urldeaccelarate} = await fetch('http://localhost:5000/s3deaccelarate', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json())

    console.log(urldeaccelarate);
    
    await fetch(urldeaccelarate, {
      method: "PUT",
      headers: {
        "Content-Type" : "multipart/form-data",
      },
      body: file6
    })
    
    alert("Deaccelarating Audio Uploaded");
  }

  const audioevaluate = async (e) => {
    e.preventDefault();
    const {result} = await fetch('http://localhost:5000/evaluateaudio', {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model
      })
    }).then(res => res.json())
  }

  const audiofinalscore = async (e) => {
    e.preventDefault();
    const res = fetch("http://localhost:5000/writefinalscore", {
      method : "post",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        brand : brand,
        model : model,
        oldprice : oldprice,
        yearsold : oldyears,
        ownership : ownership,
        location : location,
        kmsdriven : kms
      })
    });

    const result = await fetch('http://localhost:5000/finalscore');
    const y = result.json();
    const data = await fetch('http://localhost:5000/display');
    const target = await data.json();
    console.log(target['Finalscore']);

  }

  return (
    <div>
      <div className = "outer-form-div-home">
        <form id = "form-outer">

          <div>
            <input type = "text" id = "brand" onChange={(e) => setBrand(e.target.value)} 
            autoComplete = "on" placeholder='Brand'/>
          </div>
          <div>
            <input type = "text" id = "model" onChange={(e) => setModel(e.target.value)} 
             autoComplete = "on" placeholder='Model'/>
          </div>
          <div>
            <input type = "number" name = "oldprice" id = "oldprice" onChange={(e) => setOldprice(e.target.value)}  
            autoComplete = "on" placeholder='Old Price'/>
          </div>
          <div>
            <input type = "number" name = "yearsold" id = "yearold" onChange={(e) => setOldyear(e.target.value)} 
            autoComplete = "on" placeholder='Years Old'/>
          </div>
          <div>
            <input type = "number" name = "ownership" id = "ownership" onChange={(e) => setOwnership(e.target.value)} 
            autoComplete = "on" placeholder='OwnerShip'/>
          </div>
          <div>
            <input type = "text" name = "location" id = "location" onChange={(e) => setLocation(e.target.value)} 
            autoComplete = "on" placeholder='Location'/>
          </div>
          <div>
            <input type = "number" name = "kmsdriven" id = "kmsdriven" onChange={(e) => setKms(e.target.value)} 
            autoComplete = "on" placeholder='Kms Driven'/>
          </div>
          <form className='upload-details' id = "ImageForm">
            <input type="file" id = "inpFile1" className='inner-css' onChange={(e) => setFront(e.target.value)} accept="image/*"/>
            <button type = "submit" id = "btnUpload1" onClick={uploadFront}>Upload Front Image</button>
            <input type="file" id = "inpFile2" className='inner-css' onChange={(e) => setBack(e.target.value)} accept="image/*"/>
            <button type = "submit" id = "btnUpload2" onClick={uploadBack}>Upload Back Image</button>
            <input type="file" id = "inpFile3" className='inner-css' onChange={(e) => setLeft(e.target.value)} accept = "image/*"/>
            <button type = "submit" id = "btnUpload3" onClick={uploadLeft}>Upload Left Image</button>
            <input type="file" id = "inpFile4" className='inner-css' onChange={(e) => setRight(e.target.value)} accept="image/*"/>
            <button type = "submit" id = "btnUpload4" onClick={uploadRight}>Upload Right Image</button>
          </form>
          <button type = "submit" id = "btnUpload" onClick={evaluate}>Evaluate Image</button>

          <form className='upload-details' id = "AudioForm">
            <input type="file" id = "inpFile5" className='inner-css' onChange={(e) => setAccelarate(e.target.value)} accept="audio/*"/>
            <button type = "submit" id = "btnUpload5" onClick={uploadAccelarate}>Upload Accelarating Audio</button>
            <input type="file" id = "inpFile6" className='inner-css' onChange={(e) => setDeaccelarate(e.target.value)} accept="audio/*"/>
            <button type = "submit" id = "btnUpload6" onClick={uploadDeaccelarate}>Upload Deaccelarating Audio</button>
          </form>
          {/* <button type = "submit" id = "btnUpload7" onClick={audioevaluate}>Evaluate Audio</button> */}
          <div id = "finalscore">
            <button type = "submit" id = "btnUpload7" onClick={audioevaluate}>Evaluate Audio</button>
            <button type = "submit" id = "btnUpload8" onClick={audiofinalscore}>Calculate Final Score</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home