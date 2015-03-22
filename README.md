# What is it?

Aperture is a clipboard: start the server, open the webpage, paste text into
the big blue portal and pull it out on the command line. If you feel
adventurous, you can also paste text into the command line and pull it out
from the web page.

# Why?

I am doing my free time coding in a [crouton](https://github.com/dnschneid/crouton)
chroot on a chromebook. Awsome stuff, and I really like it. However, clipboard
integration is currently broken, and I have no way of sharing text snippets between
chrome and the chroot. Enter Aperture.

# How to use it?

Dead simple, really. Do a `npm install` and the launch `server.js`. Per default
the server listens on all interfaces on port 8000. Navigate there and paste something
in the big blue box --- it'll be printed on the command line where you started the
server. Now, paste something into the prompt presented by the server and watch
it replace the text in the big blue box (don't forget the final enter).

If you need more control over port and interface, try `server.js --help`.

# Can I modify it?

Knock yourself out, the code is available under the MIT license.
