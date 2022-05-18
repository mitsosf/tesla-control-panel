@extends('dashboard.base')

@section('title', 'Dashboard')
@section('content')
<div class="row" style="margin-top: 3%">
    <div class="container">
        <div id="dashboard" data-token="{{$api_token}}" data-url="{{env('APP_URL')}}"></div>
    </div>
</div>
<script src="{{asset('js/app.js')}}"></script>
@endsection
