async function generateCode() {
  const mode = $(".code").text();
  console.log(mode);
  if (mode !== "Generate") return;
  $(".code").html("Generating...");
  //make request here
  $(".code").html(456);
}

async function join() {
  //make request here
  const room = document.forms["roomForm"]["codeInput"].value;
  const valid = true;
  if (valid) {
    window.open(
      `${window.location.origin}/public/views/characterSelect.html?id=${room}&initiator=1`,
      (target = "_self")
    );
  }
}
