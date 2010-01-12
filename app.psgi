use strict;
use warnings;

return sub {
    my $env = shift;
    my $path = $env->{PATH_INFO};

    $path =~ s{^/}{};
    $path ||= 'index.html';

    my $content_type = 
    $path =~ /\.css$/ ? 'text/css' :
    $path =~ /\.js$/ ? 'application/javascript' :
    'text/html';

    open FILE, $path or die $!;
    my $file = do { local $/; <FILE> };

    [
        200,
        [ 'Content-Type' => $content_type ],
        [ $file ]
    ];
}
