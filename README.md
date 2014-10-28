### Meteor SSR test (with Iron Router)

  Example usage for Arunoda's SSR (meteorhacks:ssr) to use with Iron-Router.


Basically, what we mostly don't know about `Iron-Router` is that if you have identical routes declared for server and client, the server-side route is dispatched first and then the client-side.


## THE RESULT:

I uploaded the app at http://ssr_test.meteor.com/ to see it in action.

Test it!

http://ssr_test.meteor.com/post/123   `<-- this renders client-side`
http://ssr_test.meteor.com/post/123?_escaped_fragment_=  `<-- gee, i wonder where this renders? (hint: server-side)`

