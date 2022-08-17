@extends('dashboard.base')

@section('title', 'Dashboard')
@section('content')
<div class="container">
    <div id="dashboard" data-token="{{$api_token}}" data-car="{{$carName}}" data-url="{{env('APP_URL')}}"></div>
</div>

@endsection
