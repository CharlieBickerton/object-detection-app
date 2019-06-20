import os
import secrets
from PIL import Image
from io import BytesIO
import base64
from flask import current_app

def save_picture(img_dict):
    '''
    Function to create a random file name for the image then
    save it in the apps picture dir and return the new file name
    '''
    random_hex = secrets.token_hex(8)
    picture_fn = random_hex + '.jpeg'
    picture_path = os.path.join(current_app.root_path, 'static/prediction_pics', picture_fn)

    img_b64_string = img_dict['picture'].split(',')[1]

    img = Image.open(BytesIO(base64.b64decode(img_b64_string)))
    img.save(picture_path) # save the picture to the file system
    return picture_fn