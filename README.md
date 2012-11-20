# Backbone-pusher-poller
This is a poller for backbone.js where you give the collection to the poller. 
The code updates the collection from the server by comparing the fetched and the local version of the collection.
When the tab or window is not visible the polling pauses and continues when focus comes back.
Current version is made for Backbone Marionette but this can easily be changed.

# Usage - Init app
  	var App = new Backbone.Marionett.Application();
  	var TestModel = Backbone.Model.extend({});
  	var TestCollection = Backbone.Collection.extend({
			url: '/test',
			model: TestModel
  	});
  	var testCollection = new TestCollection();
  	var testCollection2 = new TestCollection({url:'/test2'});

# Usage - Start polling
	//start polling server
	//save the identifier to be able to turn off polling later.
	var identifier = 'collection:test:poll';
	var identifier2 = 'collection2:test:poll';
	App.pusher.addP(identifier, testCollection);
	App.pusher.addP(identifier2, testCollection);
# Usage - Pause polling
	//When you are editing a model in a collection or just want to pause for other reason.
	//Pause the poller by setting edit to true
	App.pusher.setEditing(true);
	//Start poller again after editing is done
	App.pusher.setEditing(false);
# Usage - Change polling intervall
	//Set polling time to 10000ms
	App.pusher.setTime(10000);
# Usage - Remove a specific poll
	App.pusher.removeP(identifier);
	//and the other one
	App.puser.removeP(identifier2);
# TODO
Implement ability to set last-changed-timestamp on a collection and poll server for changes after that timestamp.