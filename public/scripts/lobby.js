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
  }
  const room = document.forms["roomForm"]["codeInput"].value;
  const valid = false;
  if (!valid)
    return $(".roomForm").append(
      $(
        `<p class="error">The entered code is either invalid or has expired.</p>`
      )
    );
  window.open(
    `${window.location.origin}/public/views/characterSelect.html?id=${room}&initiator=${initiator}`,
    (target = "_self")
  );
}
