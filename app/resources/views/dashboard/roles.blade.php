@extends('dashboard.base')

@section('title', 'Users')
@section('content')
    <div class="row">
        <h3>My roles:</h3>
    </div>
    <div class="row">
        <ul>
            @foreach($roles as $role)
                <li>{{$role->description}}</li>
            @endforeach
        </ul>
    </div>

@endsection
