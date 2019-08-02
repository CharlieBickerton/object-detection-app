# object-detection-app
## Functionality
Two Features: Use a tensorflow.js mobileNet (coco-ssd) model for a live stream version when not authed. When authed - allow to predictions on livestream &amp; click to save picture + predictions by a user.

## Developer Requirements
To get this app running you will need some familiarity with React, Flask & docker (for the mongo db).

## Notes
I am using the python package dotenv https://github.com/theskumar/python-dotenv to supply secrets to the flask server using a .env file.

Please note that this is just a personal project and it is not meant to be a robust production ready web application. I will not be maintaining support for this repo. However, please feel free to get in contact if you have any questions.

## Screenshots
<img src="screenshots/authed_home.png?raw=true" alt="Non Authed homepage" style="margin-right:20px;" width="50%" height="auto"/><img src="/screenshots/account.png?raw=true" alt="Non Authed homepage" width="50%" height="auto"/>

<img src="screenshots/login.png?raw=true" alt="Non Authed homepage" style="margin-right:20px;" width="50%" height="auto"/><img src="/screenshots/register.png?raw=true" alt="Non Authed homepage" width="50%" height="auto"/>

<img src="screenshots/non_authed_home.png?raw=true" alt="Non Authed homepage" width="100%" height="auto"/>

Thank you.
