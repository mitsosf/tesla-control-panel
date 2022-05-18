<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">


        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
            .centered {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                min-height: 100vh;
            }
        </style>
    </head>
    <body>
        <div class="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
            <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div class="centered">
                    <div class="row">
                        <h4>Life, the Universe & Everything (todo)</h4>
                    </div>
                    <div class="row">
                        <img src="{{asset('img/model3.png')}}" alt="tesla">
                    </div>
                    <div class="row">
                        <a href="{{route('login.google')}}"><img width="50%" src="{{asset('img/google_login.png')}}" alt="Google login"></a>
                    </div>
                    <div class="row">
                        <a href="{{route('login.facebook')}}"><img width="20%" src="{{asset('img/facebook_login.png')}}" alt="Google login"></a>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
