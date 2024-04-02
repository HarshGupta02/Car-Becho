from skimage.metrics import structural_similarity
import cv2
import matplotlib.pyplot as plt
import os
from PIL import Image
import numpy as np
import boto3
import sys
from dotenv import load_dotenv

current_directory = os.path.dirname(os.path.abspath(__file__))
parent_directory = os.path.dirname(current_directory)
dotenv_path = os.path.join(parent_directory, 'config.env')

load_dotenv(dotenv_path, verbose = True)

AWS_BUCKET_REGION = os.getenv("AWS_BUCKET_REGION")
AWS_IMAGE_BUCKET_NAME = os.getenv("AWS_IMAGE_BUCKET_NAME")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

def downloadFromS3(my_bucket, brand, model):
  s3 = boto3.resource('s3', aws_access_key_id = AWS_ACCESS_KEY, aws_secret_access_key = AWS_SECRET_ACCESS_KEY)
  my_bucket = s3.Bucket(my_bucket)

  user_dir_front = os.path.join(parent_directory, "Images_User", "Front_View")
  user_dir_rear = os.path.join(parent_directory, "Images_User", "Rear_View")
  user_dir_left = os.path.join(parent_directory, "Images_User", "LSide_View")
  user_dir_right = os.path.join(parent_directory, "Images_User", "RSide_View")

  my_bucket.download_file(brand + "_" + model + "_" + "front", os.path.join(user_dir_front, brand + "_" + model + '.jpg'))
  my_bucket.download_file(brand + "_" + model + "_" + "back", os.path.join(user_dir_rear, brand + "_" + model + '.jpg'))
  my_bucket.download_file(brand + "_" + model + "_" + "left", os.path.join(user_dir_left, brand + "_" + model + '.jpg'))
  my_bucket.download_file(brand + "_" + model + "_" + "right", os.path.join(user_dir_right, brand + "_" + model + '.jpg'))

def orb_sim(img1, img2):
  orb = cv2.ORB_create()

  kp_a, desc_a = orb.detectAndCompute(img1, None)
  kp_b, desc_b = orb.detectAndCompute(img2, None)

  bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    
  matches = bf.match(desc_a, desc_b)
  similar_regions = [i for i in matches if i.distance < 60]  
  if len(matches) == 0:
    return 0
  return len(similar_regions) / len(matches)

def structural_sim(img1, img2):
  sim, diff = structural_similarity(img1, img2, full=True,  win_size=1, use_sample_covariance=False)
  return sim

def imageComparison(data, view_type):

  org_dir = os.path.join(parent_directory, "Images_Org", view_type)
  user_dir = os.path.join(parent_directory, "Images_User", view_type)

  for filen in os.listdir(org_dir):
    if(data + ".jpg" in filen):
      img = plt.imread(os.path.join(org_dir, data+".jpg"))

  for filen in os.listdir(user_dir):
      if(data + ".jpg" in filen):
        imga = plt.imread(os.path.join(org_dir, data+".jpg"))

  data_f = []
  data_of=[]

  orb_similarity = orb_sim(img,imga)
  data_of.append(orb_similarity)

  data_sf = []
  img_b = np.squeeze(img)
  img_c = np.squeeze(imga)
  ssim = structural_sim(img_b, img_c)
  data_sf.append(ssim)

  maxi = data_of[0];    
  maxt = data_sf[0];    

  avgg = (maxt+maxi)/2
  return avgg

brand = sys.argv[1]
model = sys.argv[2]
data = brand + "_" + model

downloadFromS3(AWS_IMAGE_BUCKET_NAME, brand, model)

avg_front = imageComparison(data, "Front_View")
avg_rear = imageComparison(data, "Rear_View")
avg_left = imageComparison(data, "LSide_View")
avg_right = imageComparison(data, "RSide_View")

total_score = (avg_front+avg_rear+avg_left+avg_right)/4

with open(os.path.join(parent_directory, "Images_Output", "out.txt"), 'w') as f:
    print(total_score, file=f)