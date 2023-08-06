# TVS_Epic_IT_Challenge

This project was made in collaboration with @Jarvis-Keshav (https://github.com/Jarvis-Keshav) for tvs_it_challenge hackathon

In this we were suppsed to automate the entire evaluation process of used automobiles such that no human intervention would be required in between.
For that we devided our project into client side and server side.

## Client Side

This is basically the frontend of our website where client/user will enter all the information regarding his vehicle like Brand,Year,Model_name,Ownershipn and Location and then to make the evaluation even better we asked users to enter their vehicle's accelerating and deaccelerating sounds and its 4 sided view for audio and image comparison as well

![Screenshot (812)](https://github.com/HarshGupta02/Car-Becho/assets/77138269/5d29e7e7-91ec-44f5-ac99-16f7794b7d0d)

![Screenshot (813)](https://github.com/HarshGupta02/Car-Becho/assets/77138269/578ae53b-8649-46d2-b91a-10cec9bbbdce)

![Screenshot (814)](https://github.com/HarshGupta02/Car-Becho/assets/77138269/b73be4cc-8732-47df-9752-7d84ac86ec55)

## Server Side

## Offloading CPU Bound Blocking Task

Since Nodejs is single threaded, hence to prevent the main thread from blocking, we handle async operations using worker threads which is basically a child process created via the spawn method and all the Machine learning computations and the computation involving downloading the images from AWS S3 and and then using those images and audio for image and audio comparison are all done in worker or child process.

```js
const child = spawner('python', ['C:/Users/HarshGupta/Desktop/Tvs-Credit-It-Challenge/server/Image_Download_Compare.py', brand, model]);
```

## Media Storage

All the images and audio of the vehicle are being uploaded to Amazon Web Services (AWS) S3 buckets. The images and audio of the new vehicles are already present in database and S3 buckets also store the media uploaded by the user. S3 buckets were preferred for media storage as the large object files like images and audio are BLOB files and storing in a nosql database like MongoDB takes a lot of space in the database and also the retreival time of media from S3 is much faster than that from MongoDB.

IMAGES S3 BUCKETS:

![Screenshot (805)](https://github.com/HarshGupta02/Car-Becho/assets/77138269/04af5797-3552-42a2-bf39-9169478a307b)

AUDIO S3 BUCKETS:

![Screenshot (806)](https://github.com/HarshGupta02/Car-Becho/assets/77138269/6f69efe4-4ed9-4d6a-85f4-2701eb0970f8)

### Image Comparison
For image comparison, images provided by the user will be located in the database by their brand_model name and 4-sided view comparisomn will be done with the original(new) pics of that brand_model using orb and structural similarity. Score for each view comparison will be generated and avg of them is taken.

![image](https://github.com/Jarvis-Keshav/Car_Valuations/assets/79581388/81a30d51-3c8c-4b52-87e6-e0f18e8c3b5b)

### Audio Comparison

Similarly, audio file matching the name(brand_model) will be searched in the database for both accelerating and deaccelerating audio, comparison will be done using audio fingerprinting (implemented using chromprint) and score for each comparison will be generated. Avarage for both the scores will be taken

![image](https://github.com/Jarvis-Keshav/Car_Valuations/assets/79581388/f485b2b3-1f50-4fa1-8512-ef9e504b69ed)

Fuzz ratio is used for generating a score based similarity

## Valuation Equation

Finally the second hand price will be evaluated using a valuation equation:
```js
New_price=(old_price-((x1*yo)+(x2*ow)+(x3*lo)+(x4*km)+(x5*(1-image_sc))+(x6*(1-audio_sc))))
```
where each coffecient is assigned weights according to how much influnce does it have on the vehicles wear n tear. (image_sc and audio_sc tells how similar images and audio are in comparison to user data, therefore 1-is done to get the dissimilarity)

![image](https://github.com/Jarvis-Keshav/Car_Valuations/assets/79581388/b9a2f35e-6bbe-438e-870d-9dfad06ba231)


## Training the Model

Now we want our model to predict this score even faster, i.e to avoid equation computaion time we'll train our data on ml(XGBoost) model. So once our databe has a minimum of 1000 enteries(model has generated output for atleast 1000 user's vehicle) then automatically our model will start using our XGBoost model but since 
our project was on the testing phase we generated synthetic samples using smote func.

![image](https://github.com/Jarvis-Keshav/Car_Valuations/assets/79581388/0a7b2922-bed4-4557-9775-323a38dd87e5)

Once a sufficent amount of synthetic samples were generated our model successfully executed the shift from scoring to predicting the score through ml model and generated a price almost similar to the one generated through non ml model
