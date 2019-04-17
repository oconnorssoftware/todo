# from django.test import TestCase
import requests,json
# Create your tests here.

def testReg(userName,emailaddress,pw):
  payload = {
    "username":userName,
    "email":emailaddress,
    "password1":pw,
    "password2":pw
  }
  resp = requests.post("http://127.0.0.1:8000/coreback/rest-auth/registration/", data=payload)
  resp = json.loads(resp.text)
  if "key" in resp.keys():
    return resp["key"]

def testAuth(authKey):
  headers = {'Authorization': 'Token {}'.format(authKey)}
  resp = requests.get("http://127.0.0.1:8000/coreback/test_auth/",headers=headers)
  print(resp.text)

def testLogin(emailaddress,pw):
  payload = {
    "email":emailaddress,
    "password":pw
  }
  resp = requests.post("http://127.0.0.1:8000/coreback/rest-auth/login/",data=payload)
  resp = json.loads(resp.text)
  if "key" in resp.keys():
    return resp["key"]


if __name__ == '__main__':
  userName = "test0014"
  emailaddress = "test0014@gmail.com"
  pw = "SomeC8mplexPW"
  authKey = testReg(userName,emailaddress,pw)
  # authKey = testLogin(emailaddress,pw)
  if authKey:
    #then test auth endpoint
    testAuth(authKey)

  #test logout