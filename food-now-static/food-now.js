// function setup() {

// }

// function draw() {
// 	ellipse(50, 50, 80, 80);
// }

function search() {
	$.ajax({ 
		type : "GET", 
		url : "https://api.yelp.com/v3/businesses/search?location=santa cruz,ca&term=boba", 
		beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'sVX4lUzEERso8L9-61gN8ZojgRWKlATmMcuAeruVlXsVd4cB8OKhlrpXWZUNN8fDeF6lY-wFxhFcHwIa9HsuhogXy1GBkarqgsY8wEkPPn4O0k1JXgsEIQ8YjXlyWnYx');},
		success : function(result) { 
			console.log(result);
			//set your variable to the result 
		}, 
		error : function(result) {
			console.log('error');
			//handle the error 
		} 
	}); 
}