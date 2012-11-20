App.module("pusher", function(pusher, App, Backbone, Marionette, $, _){
	var PusherModel = Backbone.Model.extend({});
	var Pusher = Backbone.Collection.extend({
		windowIsActive: null,
		editing: null,
		model: PusherModel,
		time: null,
		_stop: false,
		initialize: function() {
			var that = this;
			this.windowIsActive = true;
			this.editing = false;
			this.time = 5000;
			this._stop = false;
			window.onfocus = function () { 
				that.windowIsActive = true; 
			}; 
			window.onblur = function () { 
				that.windowIsActive = false; 
			}; 
			this.run();
			return this;
		},
		run: function() {
			var that = this;
			var internalRun = function() {
				if(that.windowIsActive && !that.editing ) {
					_(that.models).each(function(model) {
						console.log(model.get('e'));
						tket.vent.trigger(model.get('e'));
					}, that);
				};
				if(!that._stop) {
					window.setTimeout(internalRun, that.time);
				}
			};
			window.setTimeout(internalRun, that.time);
		},
		setEditing: function(editing) {
			this.editing = editing;
			return this;
		},
		setTime: function(time) {
			this.time = time;
			return this;
		},
		stop: function() {
			this._stop = true;
			return this;
		},
		start: function() {
			if(this._stop) {
				this._stop = false;
				window.setTimeout(this.run, this.time*2);
			}
			return this;
		},
		addP: function(trigger_event, cCollection) {
			var m = this.models.filter(function(model){ 
				return model.attributes.e == trigger_event; 
			});
			if(!m || !m.length) {
				var that = this;
				if(cCollection) {
					on = tket.vent.on(trigger_event, function() {
						that.updateCollection(cCollection);
					});
				} else {
					on = false;
				}
				this.add({e:trigger_event, on:on});
			}
			return this;
		},
		removeP: function(trigger_event) {
			var that = this;
			_(that.models).each(function(model) {
				var model_e = model.get('e');
				if ( _.isEqual(model_e, trigger_event) == true) {  
					that.remove(model);
				}
			}, that);
			tket.vent.off(trigger_event);
			return this;
		},
		updateCollection: function(collection) {
			var that = this;
			var newCollection = new collection.constructor(); 
			newCollection.url = collection.url;
			newCollection.model = collection.model;
			newCollection.fetch({
				success: function() {
					var curModelIds = that.getIdsOfModels(collection.models);
					var newModelIds = that.getIdsOfModels(newCollection.models);

					_(newCollection.models).each(function(newModel) {
						if (curModelIds.indexOf(newModel.id) == -1) { 
							collection.add(newModel);
						}
					}, that);

					_(collection.models).each(function(curModel) {
						if (newModelIds.indexOf(curModel.id) == -1) {
							collection.remove(curModel);  
						} else {
							var curModelAttributes = curModel.attributes;
							var newModelAttributes = newCollection.get(curModel.id).attributes;
							if ( _.isEqual(curModelAttributes, newModelAttributes) == false) {  
								curModel.set(newModelAttributes);
							}
						}
					}, that);
				}
			});
		},
		getIdsOfModels: function(models) {
			return _(models).map(function(model) { return model.id; });
		},
	});
	var _pusher = new Pusher();
	pusher.setEditing = function(editing) {
		_pusher.setEditing(editing);
	};
	pusher.setTime = function(time) {
		_pusher.setTime(time);
	};
	pusher.addP = pusher.add = function(trigger_event, cCollection) {
		_pusher.addP(trigger_event, cCollection);
	};
	pusher.removeP = pusher.remove = function(trigger_event) {
		_pusher.removeP(trigger_event);
	};
});