from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from . import models
from rest_auth.views import LogoutView

class TestAuthView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        print([x.message for x in models.TodoItem.objects.filter(Profile=request.user.profile)])
        return Response("Hello {0}!".format(request.user))

class ProfileView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        # return Response(request.user.profile.bio)
        return JsonResponse({"fname":request.user.first_name,"bio":request.user.profile.bio})

class TodoView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        return JsonResponse({"todos":[x.message for x in models.TodoItem.objects.filter(Profile=request.user.profile)]})

    def post(self, request, format=None):
        td = models.TodoItem(Profile=request.user.profile,message=request.data["ntodo"])
        td.save()
        return JsonResponse({"todos":[x.message for x in models.TodoItem.objects.filter(Profile=request.user.profile)]})

class Logout(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        request.user.auth_token.delete()
        return JsonResponse({"success":True})

class LogoutViewEx(LogoutView):
    authentication_classes = (authentication.TokenAuthentication,)
