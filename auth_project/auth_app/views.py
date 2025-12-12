from django.shortcuts import render, redirect 
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.contrib.auth import login, logout 
from .middlewares import auth, guest
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages



def index(request):
    return render(request, 'auth/index.html', {
        'form': AuthenticationForm(),
        'reg_form': UserCreationForm(),
    })

def anime(request):
    return render(request, 'auth/anime.html')

def movies(request):
    return render(request, 'auth/movies.html')

def contact(request):
    return render(request, 'auth/contact.html')

def about(request):
    return render(request, 'auth/about.html')

@login_required(login_url='login')
def profile_view(request):
    if request.method == 'POST':

        # ✅ Update Email
        if 'update_email' in request.POST:
            email = request.POST.get('email')
            request.user.email = email
            request.user.save()
            messages.success(request, 'Email updated successfully.')

        # ✅ Change Password
        elif 'change_password' in request.POST:
            form = PasswordChangeForm(request.user, request.POST)
            if form.is_valid():
                user = form.save()
                update_session_auth_hash(request, user)  # keep user logged in
                messages.success(request, 'Password updated successfully.')
                return redirect('profile')
        else:
            form = PasswordChangeForm(request.user)

    else:
        form = PasswordChangeForm(request.user)

    return render(request, 'auth/profile.html', {
        'password_form': form
    })

# Create your views here.

@guest
def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)     # ⬅️ don’t save yet
            user.email = request.POST.get('email')  # ✅ save email
            user.save()
            login(request, user)
            return redirect('dashboard')  # ✅ BACK TO SAME ANIMATED PAGE

    
    else:
        initial_data = {'username':'', 'password1':'','password2':""}
        form = UserCreationForm(initial=initial_data)
    return render(request, 'auth/register.html',{'form':form})    
@guest
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request,user)
            return redirect('dashboard')
    else:
        initial_data = {'username':'', 'password':''}
        form = AuthenticationForm(initial=initial_data)
    return render(request, 'auth/login.html',{'form':form})
@auth
def dashboard_view(request):
    return render(request, 'dashboard.html')

def logout_view(request):
    logout(request)
    return redirect('login')