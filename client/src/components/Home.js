import React, { useState } from "react";
import "./Home.css";
import ClockLoader from 'react-spinners/ClockLoader';
import Banner1 from '../Images/img_1.jpg';
import Banner2 from '../Images/img_2.jpg';
import axios from 'axios';

const Home = () => {

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [oldprice, setOldprice] = useState("");
  const [oldyears, setOldyear] = useState("");
  const [ownership, setOwnership] = useState("");
  const [location, setLocation] = useState("");
  const [kms, setKms] = useState("");

  const [loading1, setLoading1] = useState(0);
  const [loading2, setLoading2] = useState(0);
  const [loading3, setLoading3] = useState(0);
  const [loading4, setLoading4] = useState(0);
  const [loading5, setLoading5] = useState(0);
  const [loading6, setLoading6] = useState(0);

  const [finalprice, setFinalprice] = useState("");

  const config = {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  }

  const uploadImageToS3 = async (id, setLoading, endpoint) => {

    const file = document.querySelector(`#inpFile${id}`).files[0];
    const previewContainer = document.getElementById(`imagePreview${id}`);
    const previewImage = previewContainer.querySelector(`.image-preview__image${id}`);
    const previewDefaultText = previewContainer.querySelector(`.image-preview__default-text${id}`);

    const reader = new FileReader();
    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";
    previewImage.style.width = "300px"; 
    previewImage.style.height = "200px";

    reader.addEventListener("load", function () {
        previewImage.setAttribute("src", this.result);
    });
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('brand', brand);
    formData.append('model', model);

    setLoading(1);
    const response = await axios.post(endpoint, formData, config);
    console.log(response.data.message);
    setLoading(2);
  };

  const uploadAudioToS3 = async(id, endpoint) => {
    const AudioInput = document.querySelector(`#inpFile${id}`);
    const file = AudioInput.files[0];

    const response = await axios.post(endpoint, {
        brand: brand,
        model: model
      }, config);
    const { url } = response.data;
    await axios.put(url, file, config);
  }

  const uploadFront = async (e) => {
      e.preventDefault();
      await uploadImageToS3(1, setLoading1, '/s3front');
  };

  const uploadBack = async (e) => {
      e.preventDefault();
      await uploadImageToS3(2, setLoading2, '/s3back');
  };

  const uploadLeft = async (e) => {
      e.preventDefault();
      await uploadImageToS3(3, setLoading3, '/s3left');
  };

  const uploadRight = async (e) => {
      e.preventDefault();
      await uploadImageToS3(4, setLoading4, '/s3right');
  };

  const uploadAccelarate = async (e) => {
      e.preventDefault();
      await uploadAudioToS3(5, setLoading5, '/s3accelarate');
  };

  const uploadDeaccelarate = async (e) => {
      e.preventDefault();
      await uploadAudioToS3(6, setLoading6, '/s3deaccelarate');
  };

  const imageComparison = async (e) => {
    e.preventDefault();
    await axios.post('/evaluateImage', {
      brand: brand,
      model: model
    }, {
      headers: {
          'Content-Type': 'application/json'
      }
    });
  }

  const audioComparison = async (e) => {
    e.preventDefault();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const finalScore = async (e) => {
    e.preventDefault();
    setLoading6(1);
    await axios.post("/writefinalscore", {
      brand: brand,
      model: model,
      oldprice: oldprice,
      yearsold: oldyears,
      ownership: ownership,
      location: location,
      kmsdriven: kms
    }, config);

    const size = await axios.get('/getsize');
    const size_json = await size.json();
    const total_entries = size_json['Size'];

    if(total_entries > 1000){
      const data1 = await axios.get('/mldisplay');
      const target1 = await data1.json();
      setFinalprice(target1['Finalscoreml']);
    }else{
      const result = await axios.get('/finalscore');
      await result.json();
      await sleep(5000);
      const data = await axios.get('/display');
      const target = await data.json();
      setFinalprice(target['Finalscore']);
    }
    setLoading6(2);
  }

  return (
    <div>
      <div className="home__container">
      <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" data-bs-interval="2000">
            <img src={Banner1} class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item" data-bs-interval="2000">
            <img src={Banner2} class="d-block w-100" alt="..." />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      </div>
      <br></br>
      <div className="outer-form-div-home">
        <form id="form-outer" className="bg-container">
          <div className="input-text">
            <h2>Enter Vehicle Information</h2>
            <br></br>
            <br></br>

            <div className="outer-row-1">
              <div className="change">
                <div id="change-select-div">
                  <b>Select Brand</b>
                </div>
                <select
                  className="custom-select"
                  id="dropdown"
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option disabled selected value></option>
                  <option value="Honda">Honda</option>
                  <option value="Tvs">Tvs</option>
                </select>
              </div>

              <div>
                <div id="change-select-div">
                  <b>Select Model</b>
                </div>
                <select
                  className="custom-select"
                  id="dropdown"
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option disabled selected value></option>
                  <option value="CB_350">CB_350</option>
                  <option value="Apache">Apache</option>
                </select>
              </div>

            </div>

            <div className="outer-row-2">
              <div>
                <div id="change-select-div">
                  <b>Old Price</b>
                </div>
                <input
                  type="number"
                  name="oldprice"
                  id="dropdown"
                  onChange={(e) => setOldprice(e.target.value)}
                  autoComplete="on"
                />
              </div>
              <div>
                <div id="change-select-div">
                  <b>Years Old</b>
                </div>
                <select
                  className="custom-select"
                  id="dropdown"
                  onChange={(e) => setOldyear(e.target.value)}
                >
                  <option disabled selected value></option>
                  <option value="2010">2010</option>
                  <option value="2011">2011</option>
                  <option value="2012">2012</option>
                  <option value="2013">2013</option>
                  <option value="2014">2014</option>
                  <option value="2015">2015</option>
                  <option value="2016">2016</option>
                  <option value="2017">2017</option>
                  <option value="2018">2018</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                </select>
              </div>

            </div>

            <div>
              <div className="outer-row-3">
                <div>
                  <div id="change-select-div">
                    <b>OwnerShip</b>
                  </div>
                  <input
                    type="number"
                    name="ownership"
                    id="dropdown"
                    onChange={(e) => setOwnership(e.target.value)}
                    autoComplete="on"
                  />
                </div>

                <div>
                  <div id="change-select-div">
                    <b>Location</b>
                  </div>
                  <select
                    className="custom-select"
                    id="dropdown"
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option disabled selected value></option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujrat">Gujrat</option>
                  </select>
                  </div>
                </div>
              </div>
              <div className="outer-row-4">
              <div className="change">
                <div id="change-select-div">
                      <b>Kms Driven</b>
                    </div>
                    <input
                      type="number"
                      name="kmsdriven"
                      id="dropdown"
                      onChange={(e) => setKms(e.target.value)}
                      autoComplete="on"
                    />
              </div>

            </div>
          </div>
          <br></br>
          <br></br>
          <hr></hr>
          <br></br>

          <div className="input-text-1">
            <br></br>
            <h2>Upload Vehicle Images</h2>
            <br></br>
            <br></br>
            <div className="outer-row-5">
              <div className="divv-up">
                <div className="image-preview1" id = "imagePreview1">
                  <img src = "" alt = "Image Preview1" className="image-preview__image1"/>
                  <span className="image-preview__default-text1">Image Preview</span>
                </div>
                <input
                  type="file"
                  id="inpFile1"
                  className="inner-css"
                  accept="image/*"
                />
                <div id="change-select-div">
                  {
                    loading1 === 0 ? <button type = "submit" id = "btnUpload1" onClick={uploadFront}>Upload Front Image</button>
                    : loading1 === 1 ? <ClockLoader className="loader" size={30} color={'#FFFFFF'} loading1={loading1 === 1}/>
                    : <button id = "btnUpload1">Upload Success<b>&#x2713;</b> </button>
                  }
                </div>
              </div>
              <hr></hr>
              <div className="divv-down">
                <div className="image-preview2" id = "imagePreview2">
                  <img src = "" alt = "Image Preview2" className="image-preview__image2"/>
                  <span className="image-preview__default-text2">Image Preview</span>
                </div>
                <input
                  type="file"
                  id="inpFile2"
                  className="inner-css"
                  accept="image/*"
                />
                <div id="change-select-div">
                  {
                    loading2 === 0 ? <button type = "submit" id = "btnUpload1" onClick={uploadBack}>Upload Back Image</button>
                    : loading2 === 1 ? <ClockLoader className="loader" size={30} color={'#FFFFFF'} loading2={loading2 === 1}/>
                    : <button id = "btnUpload1">Upload Success<b>&#x2713;</b> </button>
                  }
                </div>
              </div>
            </div>
            <div className="outer-row-6">
              <hr></hr>
              <div className="divv-left">
                <div className="image-preview3" id = "imagePreview3">
                  <img src = "" alt = "Image Preview3" className="image-preview__image3"/>
                  <span className="image-preview__default-text3">Image Preview</span>
                </div>
                <input
                  type="file"
                  id="inpFile3"
                  className="inner-css"
                  accept="image/*"
                />
                <div id="change-select-div">
                  {
                    loading3 === 0 ? <button type = "submit" id = "btnUpload1" onClick={uploadLeft}>Upload Left Image</button>
                    : loading3 === 1 ? <ClockLoader className="loader" size={30} color={'#FFFFFF'} loading3={loading3 === 1}/>
                    : <button id = "btnUpload1">Upload Success<b>&#x2713;</b> </button>
                  }
                </div>
              </div>
              <hr></hr>
              <div className="divv-right">
                <div className="image-preview4" id = "imagePreview4">
                  <img src = "" alt = "Image Preview4" className="image-preview__image4"/>
                  <span className="image-preview__default-text4">Image Preview</span>
                </div>
                <input
                  type="file"
                  id="inpFile4"
                  className="inner-css"
                  accept="image/*"
                />
                <div id="change-select-div">
                  {
                    loading4 === 0 ? <button type = "submit" id = "btnUpload1" onClick={uploadRight}>Upload Right Image</button>
                    : loading4 === 1 ? <ClockLoader className="loader" size={30} color={'#FFFFFF'} loading4={loading4 === 1}/>
                    : <button id = "btnUpload1">Upload Success<b>&#x2713;</b> </button>
                  }
                  
                </div>
              </div>
            </div>
            {
              loading5 === 0 ? <button type = "submit" className = "btn btn-light" id = "right-image" onClick={imageComparison}>Evaluate Images</button>
              : loading5 === 1 ? <ClockLoader className="loader" size={30} color={'#FFFFFF'} loading5={loading5 === 1}/>
              : <button className = "btn btn-light" id = "right-image"> Evaluation Completed <b>&#x2713;</b> </button>
            }
          </div>

          <br></br>
          <hr></hr>
          <br></br>

          <div className="input-text-1">
            <br></br>
            <h2>Upload Vehicle Audio</h2>
            <br></br>
            <br></br>
            <div className="outer-row-5">
              <div className="divv-up">
              <input
                  type="file"
                  id="inpFile5"
                  className="inner-css"
                  accept="audio/*"
                />
                <div id="change-select-div-accelarate">
                  <button type = "submit" id = "btnUpload5" onClick={uploadAccelarate}>Upload Accelarating Audio</button>
                </div>
              </div>
            </div>
            <div className="outer-row-6">
              <div className="divv-right">
              <input
                  type="file"
                  id="inpFile6"
                  className="inner-css"
                  accept="audio/*"
                />
                <div id= "change-select-div-accelarate">
                  <button type = "submit" id = "btnUpload6" onClick={uploadDeaccelarate}>Upload Deaccelarating Audio</button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-dark"
              onClick={audioComparison}
              id="audio-button"
            >
              Upload Audio
            </button>
          </div>
          {
            loading6 === 0 ? <button type = "submit" className = "btn btn-dark" id = "final-score-button" onClick={finalScore}>Calculate Final Score</button>
            : loading6 === 1 ? <ClockLoader className="loader-final" size={30} color={'#000000'} loading6={loading6 === 1}/>
            : <button type = "submit" className = "btn btn-dark" id = "final-score-button" onClick={finalScore}>Re-Evaluate <b>&#x2713;</b> </button>
          }
          {
            loading6 == 2 ? <div className="score"> <div className="final-score-center">The Final Price is {finalprice}</div></div> : <div></div>
          }
        </form>
      </div>
    </div>
  );
};

export default Home;
