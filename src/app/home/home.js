angular.module( 'ngBoilerplate.home', [
    'ui.router',
    'ngResource'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
    $stateProvider.state( 'home', {
        url: '/home',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.tpl.html'
            }
        },
        data:{ pageTitle: 'Home' }
    });
})

.factory('FeedLoader', function ($resource) {
    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
        fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
    });
})

.service('FeedList', function ($rootScope, FeedLoader) {

    var feeds = [];

    var pushFeed = function (data) {
        var feed = data.responseData.feed;
        feeds.push(feed);
    };

    this.get = function() {
        var feedSources = [
            {title: 'VSauce Youtube', url: 'http://gdata.youtube.com/feeds/base/users/vsauce/uploads?alt=rss'},
            {title: 'TheJoyOfCode Tumblr', url: 'http://thejoysofcode.tumblr.com/rss'},
            {title: 'Gifs Reddit', url: 'http://www.reddit.com/r/gifs/.rss'}
        ];
        if (feeds.length === 0) {
            for (var i=0; i<feedSources.length; i++) {        
                FeedLoader.fetch({q: feedSources[i].url, num: 10}, {}, pushFeed);
            }
        }
        return feeds;
    };
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope, FeedList) {
    $scope.feeds = FeedList.get();
    $scope.$on('FeedList', function (event, data) {
        $scope.feeds = data;
    });
})

;

