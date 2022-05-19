@extends('dashboard.base')

@section('title', 'Dashboard')
@section('content')
<div class="row" style="margin-top: 3%">
    <div class="container">
        <div id="dashboard" data-token="{{$api_token}}" data-car="{{$carName}}" data-url="{{env('APP_URL')}}"></div>
    </div>
</div>
<script src="{{asset('js/app.js')}}"></script>
<link rel="stylesheet" href="{{asset('css/app.css')}}">
@endsection
