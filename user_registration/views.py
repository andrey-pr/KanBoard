from django.shortcuts import render, redirect

from user_registration.forms import UserForm


def register(request):
    if request.method == 'GET':
        form = UserForm()
        return render(request,
                      'registration.html',
                      context={'form': form})
    if request.method == 'POST':
        form = UserForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            user.set_password(user.password)
            user.save()
            return redirect('successful_registration')
        return render(request,
                      'registration.html',
                      context={'form': form})


def successful_registration(request):
    return render(request,
                  'successful_registration.html',
                  context={})
