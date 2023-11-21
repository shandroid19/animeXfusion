async function generateCode() {
  const mode = $(".code").text();
  if (mode !== "Generate") return;
  $(".code").html("Generating...");
  //make request here
  $(".code").html(456);
}

async function join(initiator) {
  //make request here
  if (initiator) {
    if ($(".code").text() === "Generate")
      return $(".generateCode").append(
        $(`<p class="error">Generate the code first</p>`)
      );
  } else {
    var room = document.forms["roomForm"]["codeInput"].value;
    const valid = true;
    if (!valid)
      return $(".roomForm").append(
        $(".error").html(
          "The code you have entered is in use currently. Try a different code."
        )
      );
  }
  window.open(
    `${window.location.origin}/public/views/characterSelect.html?id=${room}&initiator=${initiator}`,
    (target = "_self")
  );
}
