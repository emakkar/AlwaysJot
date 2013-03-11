//MODELS
var Note = Backbone.Model.extend({});
var note = new Note({
	title: "Dr. Contact Info", 
	content: "Dr. Stepens, 123 Fake St. Richmond VA 23219"
});

//VIEWS
var NoteView = Backbone.View.extend({
	tagName: "ul", //div is the default
	className: "box",
	template: _.template("<li><h3><%= title %></h3><p><%= content %></p></li>"),
	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	events: {
		"click" : "open"
	},
	open: function () {
		AlwaysJotApp.navigate("note/" + this.model.id, true);
	}
});

var NoteDetailView = NoteView.extend({
	className: "box detail",
	events: {
		"click" : "edit"
	},
	edit: function () {
		AlwaysJotApp.navigate("note/" + this.model.id + "/edit", true);
	}
});

var NoteEditView = NoteView.extend({
	className: "box edit",
	template: _.template("<li><h3><input type='text' value='<%= title %>'></input></h3><textarea><%= content %></textarea></li>")
});

//COLLECTIONS
var NoteList = Backbone.Collection.extend({model: Note});
var notes = new NoteList( [{title: "Accomplishments", content: "Met Sales Goals, Improved Hiring Process"},
  {title: "Shopping List", content: "Egg, Bacon, Milk, Toilet Paper"},
  {title: "HH Quote", content: "Education is the way to achieve far-reaching results, it is the proper way to promote compassion and tolerance in society."}]);


//COLLECTION VIEW
var NoteListView = Backbone.View.extend({
	initialize: function () {
		this.collection.on('add', this.addOne, this);
	},
	render: function () {
		this.collection.forEach(this.addOne, this);
	},
	addOne: function (note) {
		var noteView = new NoteView({model: note});
		this.$el.append(noteView.render().el);
	}

});
var notesView = new NoteListView({collection: notes});


//ROUTERS
var AlwaysJotApp = new (Backbone.Router.extend({
	routes: {
		"":"index", 
		"note/:id": "show",
		"note/:id/edit": "edit"},
	initialize: function () {
		this.noteList = new NoteList([{id: 1, title: "Accomplishments", content: "Met Sales Goals, Improved Hiring Process"},
  {id: 2, title: "Shopping List", content: "Egg, Bacon, Milk, Toilet Paper"},
  {id: 3,title: "HH Quote", content: "Education is the way to achieve far-reaching results, it is the proper way to promote compassion and tolerance in society."}]);
	},
	start: function () {
		Backbone.history.start({pushState: true});
	},
	index: function () {
		//this.noteList.fetch();
		this.noteListView = new NoteListView({collection: this.noteList});
		this.noteListView.render();
		$("#app").html(this.noteListView.el);
	},
	show: function (id) {
		var noteView = new NoteDetailView({model: this.noteList.get(id)});
		$("#app").html(noteView.render().el);
	},
	edit: function (id) {
		var noteView = new NoteEditView({model: this.noteList.get(id)});
		$("#app").html(noteView.render().el);
	}
}));

$(function(){
	AlwaysJotApp.start();	
});