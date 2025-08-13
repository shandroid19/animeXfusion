async function generateCode() {
  const mode = $(".code").text();
  if (mode !== "Generate") return;
  $(".code").html("Generating...");
  //make request here
  $(".code").html(456);
}

async function join() {
  var room = document.forms["roomForm"]["codeInput"].value;
  const origin = "http://localhost:5000";
  // const origin = "https://animexfusion-backend.onrender.com";
  $.ajax({
    url: `${origin}/checkRoom/${room}`,
    type: "GET",
    success: function (data) {
      console.log(data);
      window.open(
        `${window.location.origin}${
          window.location.origin === "http://127.0.0.1:5500"
            ? "/frontend/public"
            : ""
        }/views/characterSelect.html?id=${room}&online=1`,
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

//
