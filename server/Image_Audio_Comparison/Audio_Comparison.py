import sys
import librosa, librosa.display
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
from scipy.stats import ttest_ind
import matplotlib.patheffects as path_effects
import acoustid
import chromaprint
import seaborn as sns
from fuzzywuzzy import fuzz
import boto3
from boto3.session import Session
from dotenv import load_dotenv

current_directory = os.path.dirname(os.path.abspath(__file__))
parent_directory = os.path.dirname(current_directory)
dotenv_path = os.path.join(parent_directory, 'config.env')

load_dotenv(dotenv_path, verbose = True)

AWS_BUCKET_REGION = os.getenv("AWS_BUCKET_REGION")
AWS_AUDIO_BUCKET_NAME = os.getenv("AWS_AUDIO_BUCKET_NAME")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

def downloadFromS3(my_bucket, brand, model):
  s3 = boto3.resource('s3', aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_ACCESS_KEY)
  my_bucket = s3.Bucket(my_bucket)

  user_dir_accelarate = os.path.join(parent_directory, "Audio_User", "Accelarate")
  user_dir_deaccelarate = os.path.join(parent_directory, "Audio_User", "Deaccelarate")

  my_bucket.download_file(brand + "_" + model + "_" + "accelarate", os.path.join(user_dir_accelarate, brand + "_" + model + '.wav'))
  my_bucket.download_file(brand + "_" + model + "_" + "deaccelarate", os.path.join(user_dir_deaccelarate, brand + "_" + model + '.wav'))

def audioComparison(data, view_type):
  for filen in os.listdir("C:/Users/HarshGupta/Desktop/Audio_org/Accelerating/"):
    if(data + ".wav" in filen):
      file1 = "C:/Users/HarshGupta/Desktop/Audio_org/Accelerating/"+ data +".wav"

  file2 = "C:/Users/HarshGupta/Desktop/Audio_user/Accelerating/" + data + ".wav"

  signal,sr=librosa.load(file1, sr=22050)

  duration, fp_encoded = acoustid.fingerprint_file(file1)
  fingerprint1 = chromaprint.decode_fingerprint(fp_encoded)
  duration, fp_encoded2 = acoustid.fingerprint_file(file2)
  fingerprint2 = chromaprint.decode_fingerprint(fp_encoded2)

  similarity = fuzz.ratio(fingerprint1, fingerprint2)

  total_score = similarity

  for filen in os.listdir("C:/Users/HarshGupta/Desktop/Audio_org/Deaccelerating/"):
      if(data + ".wav" in filen):
        file3 = "C:/Users/HarshGupta/Desktop/Audio_org/Deaccelerating/"+data+".wav"

  file4 = "C:/Users/HarshGupta/Desktop/Audio_user/Deaccelerating/" + data + ".wav"

  duration, fp_encoded3 = acoustid.fingerprint_file(file3)
  fingerprint3, version = chromaprint.decode_fingerprint(fp_encoded3)
  duration, fp_encoded4  = acoustid.fingerprint_file(file4)
  fingerprint4, version = chromaprint.decode_fingerprint(fp_encoded4)

  similarity2 = fuzz.ratio(fingerprint3, fingerprint4)

  total_score2 = similarity2;

  final_score = (similarity+similarity2)/2;

brand = sys.argv[1]
model = sys.argv[2]
data = brand + "_" + model

audioComparison(data, "Accelarating")
audioComparison(data, "Deaccelarating")

with open('C:/Users/HarshGupta/Desktop/Audio_output/Final_out.txt', 'w') as f:
    print(final_score, file=f)