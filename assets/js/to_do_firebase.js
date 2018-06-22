var line_height;
var todosRef = firebase.database().ref('todos');
var data;

window.onload = function() {
  bind();

  //getting and displaying elements from firebase database
  todosRef.on('value', function(snapshot) {
    data = snapshot;
    console.log(data);
    //bold first list item because it is the title
    $(".list").html('');
    $(".list").append($("<li>Your Todos</li>"));
    $("li:first").css("font-weight", "bold");
      snapshot.forEach(function(childSnapshot) {
        $(".list").append($("<li>" + childSnapshot.val() + "<btn class='hide remove_todo_btn'>Remove Todo</btn></li>"));
        bind_last();
        //makes sure the red lines are the proper length
        //for the number of items in the list
        line_height = $("li").length * 45.67;
        $(".lines").css("height", line_height);
      });
  });

};

function bind_last(){
  $("li:last").hover(function(){
    $(this).children().fadeIn("fast", function(){
      $(this).children().removeClass("hide");
    });
  }, function(){
    $(this).children().fadeOut("fast", function(){
      $(this).children().addClass("hide");
    });
  });
  $(".remove_todo_btn:last-child").click(function(){
    var toSearch = $(this).parent().text();
    data.forEach(function(snapshot){
      var equal_length = snapshot.val().length + 11;
      if(toSearch.search(snapshot.val()) != -1 && (toSearch.length == equal_length)){
        snapshot.ref.remove();
      }
    });
    line_height = $("li").length * 45.67;
    $(".lines").css("height", line_height);
  });
}

function bind(){
  $(".add_todo_btn").click(function(){
      if($("input").val() != ""){
        $(".list").html('');
        todosRef.push($("input").val());
        $("input").val("");
        $(".lines").css("height", line_height);
        bind_last();
      }
  });

  $(document).keypress(function(event){
    if(event.which == 13){
      if($("input").val() != ""){
        $(".list").html('');
        todosRef.push($("input").val());
        $("input").val("");
        $(".lines").css("height", line_height);
        bind_last();
      }
    }
  });
}
