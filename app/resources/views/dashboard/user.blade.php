@extends('dashboard.base')

@section('title', 'User')
@section('content')
    <div class="row" style="margin-top: 3%">
        <div class="container">
            <a class="btn btn-danger" href="{{route('user.delete',$user->id)}}">Delete</a>
            <div id="user" data-token="{{$api_token}}" data-user="{{$user}}" data-roles="{{$roles}}" data-url="{{env('APP_URL')}}"></div>
        </div>
    </div>
@endsection

