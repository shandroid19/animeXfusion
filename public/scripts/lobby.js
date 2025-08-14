async function generateCode() {
  const mode = $(".code").text();
  if (mode !== "Generate") return;
  $(".code").html("Generating...");
  //make request here
  $(".code").html(456);
}

// const origin = "http://localhost:5000";
const origin = "https://animexfusion-backend.onrender.com";

async function join() {
  var room = document.forms["roomForm"]["codeInput"].value.trim();

  // Validate 6-digit code
  if (!room || room.length !== 6 || !/^\d{6}$/.test(room)) {
    $(".error").html("Please enter a valid 6-digit code");
    return;
  }

  try {
    const response = await $.ajax({
      url: `${origin}/checkRoom/${room}`,
      type: "GET",
    });

    console.log(response);
    window.open(
      `${window.location.origin}${
        window.location.origin === "http://127.0.0.1:5500" ? "/public" : ""
      }/views/characterSelect.html?id=${room}&online=1`,
      (target = "_self")
    );
  } catch (error) {
    console.log(error);
    $(".error").html("Invalid room code. Please try again.");
  }
}

//
