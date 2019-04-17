<html>
# django-backend-template
<br>
This is a template for using django as a backend for a user driven web application.  This project is ready to go with registration, login, password reset, and profile creation.  
<br><br>
To Run:
<br>
pip install -r requirements.txt<br>
python manage.py makemigrations coreback<br>
python mange.py migrate<br>
python manage.py runserver<br>
<br><br>
You can follow the docs at https://django-rest-auth.readthedocs.io/en/latest/ for guidence on how to use the API.
  
To make a user:<br>
```
payload = {
  "username":userName,
  "email":emailaddress,
  "password1":pw,
  "password2":pw
}
resp = requests.post("http://127.0.0.1:8000/coreback/rest-auth/registration/", data=payload)
```
To Login as a user:<br>
```
payload = {
  "email":emailaddress,
  "password":pw
}
resp = requests.post("http://127.0.0.1:8000/coreback/rest-auth/login/",data=payload)
```
<br>
To bring back the user's profile information:<br>

```
#assuming authKey is a valid auth key
headers = {'Authorization': 'Token {}'.format(authKey)}
resp = requests.get("http://127.0.0.1:8000/coreback/profile/",headers=headers)
```

</html>
