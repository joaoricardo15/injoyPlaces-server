window.onload = function() {
  
  $(document).ready(function(){
    
    $("#resultModal").on('show.bs.modal', function () {

      $(".modal-title").html( "resultados para " + $("#my_name").val() + " & " + $("#someoneelse_name").val() );
      
    });

    $("#resultModal").on('hide.bs.modal', function () {
      $("#my_name").val("");
      $("#someoneelse_name").val("");
    });
    
  });

};



