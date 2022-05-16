<h2>Welcome {{Auth::user()->name}}</h2>
<a href="{{route('logout')}}">Logout</a>

<div class="row" style="margin-top: 3%">
    <div class="container">
        {{$api_token}}
        <div id="dashboard" data-token="{{$api_token}}" data-url="{{env('APP_URL')}}"></div>
    </div>
</div>
<script src="{{asset('js/app.js')}}"></script>
