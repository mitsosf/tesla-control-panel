@extends('dashboard.base')

@section('title', 'My roles')
@section('content')
    <div class="container">
        <ul>
            @foreach($roles as $role)
                <li>{{$role->description}}</li>
            @endforeach
        </ul>
    </div>
@endsection
