async function generateCode() {
  const mode = $(".code").text();
  if (mode !== "Generate") return;
  $(".code").html("Generating...");
  //make request here
  $(".code").html(456);
}

async function join() {
  console.log("hello");
  var room = document.forms["roomForm"]["codeInput"].value;
  $.ajax({
    url: `http://localhost:5000/checkRoom/${room}`,
    type: "GET",
    success: function (data) {
      console.log(data);
      window.open(
        `${window.location.origin}/public/views/characterSelect.html?id=${room}&online=1`,
        (target = "_self")
      );
    },
    error: function (request, error) {
      console.log(error);
      return $(".roomForm").append(
        $(".error").html(
          "The code you have entered is in use currently. Try a different code."
        )
      );
    },
  });
}
