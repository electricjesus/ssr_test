Router.configure({
  layout: 'default'
});

Posts = new Mongo.Collection('posts');

UI.registerHelper('is_server', function(){
  return Meteor.isServer ? 'from server' : 'from client';
});

myRouter = null;

if(Meteor.isServer) {

  // watch out for common robot user-agent headers.. you can add more here.
  // taken from MDG's spiderable package.

  var userAgentRegExps = [
    /^facebookexternalhit/i, 
    /^linkedinbot/i, 
    /^twitterbot/i
  ];

  // Wire up the data context manually since we can't use data option 
  //   in server side routes while overriding the default behaviour.. 
  //   not this way, at least (with SSR).
  //   use {{#with getPost}} to 
  Template.view_post_server.helpers({
    'getPost' : function(id) {
      return Posts.findOne({_id : id});
    }
  });

  Router.map(function() {    
    this.route('view_post', {
      path: 'post/:id',       // post/:id  i.e. post/123
      where: 'server',        // this route runs on the server
      action : function() {
          var request = this.request;

          // Also taken from MDG's spiderable package.
          if (/\?.*_escaped_fragment_=/.test(request.url) ||
          _.any(userAgentRegExps, function (re) {
            return re.test(request.headers['user-agent']); })) {          
        
            // The meat of the SSR rendering. We render a special template
            var html = SSR.render('view_post_server', {id : this.params.id});
            var response = this.response;
            response.writeHead(200, {'Content-Type':'text/html'});
            response.end(html);

          } else {
            this.next();
          }         
      }
    });
  });          


}

if(Meteor.isClient) {
  Router.map(function() {
    this.route('home');
    this.route('view_post', { // same route as the server-side version
      path: 'post/:id',       // and same request path to match
      where: 'client',        // but just run the following action on client
      action : function() {
          this.render('view_post'); // yup, just render the client-side only 
      }
    });
  });
}

