(function(c){module("URI parsing");test("identical URIs should give identical objects",function(){var b=c.uri("http://www.example.org/foo"),d=c.uri("http://www.example.org/foo");ok(b===b,"a uri is equal to itself");ok(b===d,"a uri is equal to the same uri")});test("resolving a URI should give identical objects",function(){var b=c.uri("http://www.example.org/foo"),d=c.uri.resolve("../foo","http://www.example.org/bar");ok(b===d,"a uri is equal to the same uri")});test("foo URI with all parts",function(){var b=
c.uri("foo://example.com:8042/over/there?name=ferret#nose");equals(b.scheme,"foo");equals(b.authority,"example.com:8042");equals(b.path,"/over/there");equals(b.query,"name=ferret");equals(b.fragment,"nose")});test("foo URI without a fragment",function(){var b=c.uri("foo://example.com:8042/over/there?name=ferret");equals(b.scheme,"foo");equals(b.authority,"example.com:8042");equals(b.path,"/over/there");equals(b.query,"name=ferret");equals(b.fragment,undefined)});test("foo URI without a query",function(){var b=
c.uri("foo://example.com:8042/over/there#nose");equals(b.scheme,"foo");equals(b.authority,"example.com:8042");equals(b.path,"/over/there");equals(b.query,undefined);equals(b.fragment,"nose")});test("foo URI without a path",function(){var b=c.uri("foo://example.com:8042?name=ferret#nose");equals(b.scheme,"foo");equals(b.authority,"example.com:8042");equals(b.path,"");equals(b.query,"name=ferret");equals(b.fragment,"nose")});test("foo URI without an authority",function(){var b=c.uri("foo:/over/there?name=ferret#nose");
equals(b.scheme,"foo");equals(b.authority,undefined);equals(b.path,"/over/there");equals(b.query,"name=ferret");equals(b.fragment,"nose")});test("URI with a capitalised scheme",function(){var b=c.uri("FOO:/over/there?name=ferret#nose");equals(b.scheme,"foo")});test("URI without an authority",function(){var b=c.uri("urn:example:animal:ferret:nose");equals(b.scheme,"urn");equals(b.authority,undefined);equals(b.path,"example:animal:ferret:nose");equals(b.query,undefined);equals(b.fragment,undefined)});
module("URI Building");test("A URI with all parts",function(){equals(c.uri("foo://example.com:8042/over/there?name=ferret#nose"),"foo://example.com:8042/over/there?name=ferret#nose")});module("URI Reference Resolution Examples: Normal Examples");var a=c.uri("http://a/b/c/d;p?q");test("g:h",function(){equals(a.resolve("g:h"),"g:h")});test("g",function(){equals(a.resolve("g"),"http://a/b/c/g")});test("./g",function(){equals(a.resolve("./g"),"http://a/b/c/g")});test("g/",function(){equals(a.resolve("g/"),
"http://a/b/c/g/")});test("/g",function(){equals(a.resolve("/g"),"http://a/g")});test("//g",function(){equals(a.resolve("//g"),"http://g")});test("?y",function(){equals(a.resolve("?y"),"http://a/b/c/d;p?y")});test("g?y",function(){equals(a.resolve("g?y"),"http://a/b/c/g?y")});test("#s",function(){equals(a.resolve("#s"),"http://a/b/c/d;p?q#s")});test("g#s",function(){equals(a.resolve("g#s"),"http://a/b/c/g#s")});test("g?y#s",function(){equals(a.resolve("g?y#s"),"http://a/b/c/g?y#s")});test(";x",function(){equals(a.resolve(";x"),
"http://a/b/c/;x")});test("g;x",function(){equals(a.resolve("g;x"),"http://a/b/c/g;x")});test("g;x?y#s",function(){equals(a.resolve("g;x?y#s"),"http://a/b/c/g;x?y#s")});test("empty relative URI",function(){equals(a.resolve(""),"http://a/b/c/d;p?q")});test(".",function(){equals(a.resolve("."),"http://a/b/c/")});test("./",function(){equals(a.resolve("./"),"http://a/b/c/")});test("..",function(){equals(a.resolve(".."),"http://a/b/")});test("../",function(){equals(a.resolve("../"),"http://a/b/")});test("../g",
function(){equals(a.resolve("../g"),"http://a/b/g")});test("../..",function(){equals(a.resolve("../.."),"http://a/")});test("../../",function(){equals(a.resolve("../../"),"http://a/")});test("../../g",function(){equals(a.resolve("../../g"),"http://a/g")});module("URI Reference Resolution Examples: Abnormal Examples");test("../../../g",function(){equals(a.resolve("../../../g"),"http://a/g")});test("../../../../g",function(){equals(a.resolve("../../../../g"),"http://a/g")});test("/./g",function(){equals(a.resolve("/./g"),
"http://a/g")});test("/../g",function(){equals(a.resolve("/../g"),"http://a/g")});test("g.",function(){equals(a.resolve("g."),"http://a/b/c/g.")});test(".g",function(){equals(a.resolve(".g"),"http://a/b/c/.g")});test("g..",function(){equals(a.resolve("g.."),"http://a/b/c/g..")});test("..g",function(){equals(a.resolve("..g"),"http://a/b/c/..g")});test("./../g",function(){equals(a.resolve("./../g"),"http://a/b/g")});test("./g/.",function(){equals(a.resolve("./g/."),"http://a/b/c/g/")});test("g/./h",
function(){equals(a.resolve("g/./h"),"http://a/b/c/g/h")});test("g/../h",function(){equals(a.resolve("g/../h"),"http://a/b/c/h")});test("g;x=1/./y",function(){equals(a.resolve("g;x=1/./y"),"http://a/b/c/g;x=1/y")});test("g;x=1/../y",function(){equals(a.resolve("g;x=1/../y"),"http://a/b/c/y")});test("g?y/./x",function(){equals(a.resolve("g?y/./x"),"http://a/b/c/g?y/./x")});test("g?y/../x",function(){equals(a.resolve("g?y/../x"),"http://a/b/c/g?y/../x")});test("g#s/./x",function(){equals(a.resolve("g#s/./x"),
"http://a/b/c/g#s/./x")});test("g#s/../x",function(){equals(a.resolve("g#s/../x"),"http://a/b/c/g#s/../x")});module("Additional tests");test("resolving a URN against a URI",function(){equals(a.resolve("urn:isbn:0140449132"),"urn:isbn:0140449132")});test("resolving a URI whose base is not absolute",function(){try{var b=c.uri.resolve("foo","bar");ok(false,"should raise an error: "+b)}catch(d){ok(true,"should raise an error")}});test("resolving an absolute URI with no base provided",function(){try{c.uri.resolve("http://www.example.org/foo");
ok(true,"should not throw an error")}catch(b){ok(false,"should not throw an error")}});test("URI without a scheme",function(){var b=c.uri("/foo");equals(b,c.uri.base().resolve("/foo"))});module("Base URI");test("with no base specified",function(){equals(c.uri.base(),document.location.href)});test("with a base specified",function(){c("head").append('<base href="http://www.example.org/foo" />');equals(c.uri.base(),"http://www.example.org/foo");c("head > base").remove()});module("Creating relative URIs");
a=c.uri("http://a/b/c/d;p?q");test("g:h",function(){equals(a.relative("g:h"),"g:h")});test("http://a/b/c/g",function(){equals(a.relative("http://a/b/c/g"),"g")});test("http://a/b/c/g/",function(){equals(a.relative("http://a/b/c/g/"),"g/")});test("http://a/g",function(){equals(a.relative("http://a/g"),"/g")});test("http://g",function(){equals(a.relative("http://g"),"http://g")});test("http://a/b/c/d;p?y",function(){equals(a.relative("http://a/b/c/d;p?y"),"?y")});test("http://a/b/c/g?y",function(){equals(a.relative("http://a/b/c/g?y"),
"g?y")});test("http://a/b/c/d;p?q#s",function(){equals(a.relative("http://a/b/c/d;p?q#s"),"#s")});test("http://a/b/c/g#s",function(){equals(a.relative("http://a/b/c/g#s"),"g#s")});test("http://a/b/c/g?y#s",function(){equals(a.relative("http://a/b/c/g?y#s"),"g?y#s")});test("http://a/b/c/;x",function(){equals(a.relative("http://a/b/c/;x"),";x")});test("http://a/b/c/g;x",function(){equals(a.relative("http://a/b/c/g;x"),"g;x")});test("http://a/b/c/g;x?y#s",function(){equals(a.relative("http://a/b/c/g;x?y#s"),
"g;x?y#s")});test("http://a/b/c/d;p?q",function(){equals(a.relative("http://a/b/c/d;p?q"),"")});test("http://a/b/",function(){equals(a.relative("http://a/b/"),"../")});test("http://a/b/g",function(){equals(a.relative("http://a/b/g"),"../g")});test("http://a/",function(){equals(a.relative("http://a/"),"/")});test("http://a/g",function(){equals(a.relative("http://a/g"),"/g")})})(jQuery);