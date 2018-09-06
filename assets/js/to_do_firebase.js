var line_height;
var todosRef = firebase.database().ref('todos');
var data = [];

window.onload = function() {
  bind();

  //getting and displaying elements from firebase database
  todosRef.on('value', function(snapshot) {
    //bold first list item because it is the title
    $(".list").html('');
    $(".list").append($("<li>Your Todos</li>"));
    $("li:first").css("font-weight", "bold");
      snapshot.forEach(function(childSnapshot) {
        var toAdd = "<li>" + childSnapshot.val().value + "<btn class='hide remove_todo_btn'>Remove Todo</btn></li>";
        if(childSnapshot.val().crossout){
          $(toAdd).addClass('crossed_out');
        }
        $(".list").append($(toAdd));
        bind_last();
        //makes sure the red lines are the proper length
        //for the number of items in the list
        line_height = $("li").length * 45.67;
        $(".lines").css("height", line_height);
      });
  });
};

function bind_last(){
  var counter = 0;
  $("li:last").click(function(){
    counter++;
    $(this).toggleClass("crossed_out");
    for(var i = 0; i < data.length; i++){
      console.log(data[i]);
      if($(this).html().split("<")[0] == data[i].value){
        if(counter % 2 == 1){
          data[i].crossout = true;
          todosRef.child(data[i].value).set(data[i]);
        }else{
          data[i].crossout = false;
          todosREf.child(data[i].value).set(data[i]);
        }
      }
    }
  });
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
        // $(".list").html('');
        todosRef.push($("input").val()).then(bind_last());
        $("input").val("");
        $(".lines").css("height", line_height);
        bind_last();
      }
  });

  $(document).keypress(function(event){
    if(event.which == 13){
      if($("input").val() != ""){
        todosRef.child($("input").val()).set({value:$("input").val(), crossout:false}).then(bind_last());
        data.push({value:$("input").val(), crossout:false});
        $("input").val("");
        $(".lines").css("height", line_height);
        bind_last();
      }
    }
  });
}
