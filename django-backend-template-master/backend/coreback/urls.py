from django.urls import path, include
from django.conf.urls import url
from rest_auth.views import LoginView
from . import views

# urlpatterns = [
# 	path('login/', LoginView, name='login'),
# 	path('test_auth/', views.TestAuthView.as_view(), name='test_auth'),
# 	path('logout/', views.LogoutViewEx.as_view(), name='logout')
# ]
#curl --heaT --data '{"username":"bob","email":"bob@bob.com","password":"viper7113"}' http://127.0.0.1:8000/coreback/rest-auth/login/
urlpatterns = [
	url(r'^rest-auth/', include('rest_auth.urls')),
	url(r'^test_auth/', views.TestAuthView.as_view(), name='test_auth'),
	url(r'^profile/', views.ProfileView.as_view(), name='profile'),
	url(r'^todo/', views.TodoView.as_view(), name='todo'),
	url(r'^logout/', views.Logout.as_view(), name='logout'),
	url(r'^rest-auth/registration/', include('rest_auth.registration.urls'))
]