@extends('dashboard.base')

@section('title', 'User')
@section('content')
    <div class="row" style="margin-top: 3%">
        <div class="container">
            <div id="user" data-token="{{$api_token}}" data-user="{{$user}}" data-roles="{{$roles}}" data-url="{{env('APP_URL')}}"></div>
        </div>
    </div>

@endsection

