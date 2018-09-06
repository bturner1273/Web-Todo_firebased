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

    data = [];
      snapshot.forEach(function(childSnapshot) {
        var toAdd = $("<li>" + childSnapshot.val().value + "<btn class='hide remove_todo_btn'>Remove Todo</btn></li>");
        if(childSnapshot.val().crossout){
          toAdd = $(toAdd).addClass('crossed_out');
        }
        data.push({value:childSnapshot.val().value, crossout:childSnapshot.val().crossout});
        $(".list").append(toAdd);
        //makes sure the red lines are the proper length
        //for the number of items in the list
        line_height = $("li").length * 45.67;
        $(".lines").css("height", line_height);
        bind_last();
      });
  });
};

function bind_last(){
  $("li:last").click(function(){
    for(var i = 0; i < data.length; i++){
      if($(this).html().split("<")[0] == data[i].value){
        if(data[i].crossout){
          $(this).removeClass('crossed_out');
          data[i].crossout = false;
          todosRef.child(data[i].value).set(data[i]);
        }else{
          $(this).addClass('crossed_out');
          data[i].crossout = true;
          todosRef.child(data[i].value).set(data[i]);
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
    var toRemove = $(this).parent().html().split("<")[0];
    todosRef.child(toRemove).remove();
    $(this).parent()[0].remove();
    console.log(toRemove, $(this).parent()[0]);
    line_height = $("li").length * 45.67;
    $(".lines").css("height", line_height);
  });
}


function bind(){
  $(".add_todo_btn").click(function(){
      if($("input").val() != ""){
        // $(".list").html('');
        todosRef.child($("input").val()).set({value:$("input").val(), crossout:false}).then(bind_last());
        data.push({value:$("input").val(), crossout:false});        $("input").val("");
        $(".lines").css("height", line_height);
        $("input").val("");
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
