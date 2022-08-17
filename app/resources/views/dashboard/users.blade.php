@extends('dashboard.base')

@section('title', 'Users')
@section('content')
<div class="container">
    <table id="users" class="table table-striped table-bordered" style="width:100%">
        <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Provider</th>
            <th>Roles</th>
        </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
                <tr>
                    <td><a href="{{route('user.edit', $user->id)}}">{{$user->name}}</a>
                        <img src="{{$user->avatar}}" class="img-circle elevation-2" height="30px">
                    </td>
                    <td>{{$user->email}}</td>
                    <td>{{$user->provider()}}</td>
                    <td>
                        @foreach($user->roles as $role)
                            @if($role->name === 'admin')
                                <span class="badge badge-danger">{{$role->name}}</span>
                            @elseif(in_array($role->name, ['lock', 'driver', 'climate']))
                                <span class="badge badge-warning">{{$role->name}}</span>
                            @else
                                <span class="badge badge-info">{{$role->name}}</span>
                            @endif
                        @endforeach
                    </td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Provider</th>
                <th>Roles</th>
            </tr>
        </tfoot>
    </table>
</div>

@endsection

@section('scripts-bottom')
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.12.1/js/dataTables.bootstrap4.min.js"></script>

    <script>
        $(document).ready(function () {$('#users').DataTable({})})
    </script>
@endsection

@section('css-bottom')
    <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/dataTables.bootstrap4.min.css">

@endsection
