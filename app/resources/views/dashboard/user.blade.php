@extends('dashboard.base')

@section('title', 'User')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <a style="margin-bottom: 5%" class="btn btn-danger" href="{{route('user.delete',$user->id)}}">Delete</a>
                <a style="margin-bottom: 5%" class="btn btn-success"
                   href="{{route('user.grant_indefinite_roles',$user->id)}}">Indefinite roles</a>
                <a style="margin-bottom: 5%" class="btn btn-info" href="{{route('user.toggleFavorite', $user->id)}}">
                    @if($user->favorite)
                        <i class="bi bi-star-fill"></i> :)
                    @else
                        <i class="bi bi-star"></i> :(
                    @endif

                </a>
                <br>
                <div id="user" data-token="{{$api_token}}" data-user="{{$user}}" data-roles="{{$all_roles}}"
                     data-url="{{env('APP_URL')}}"></div>
            </div>
            <div class="col-md-6">
                @include('dashboard.shared.my_roles')
            </div>
        </div>
    </div>
@endsection

