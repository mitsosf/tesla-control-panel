<ul>
    @foreach($roles as $role)
        <li>{{$role->description}} (valid until {{$role->pivot?->expires_at}})</li>
    @endforeach
</ul>
