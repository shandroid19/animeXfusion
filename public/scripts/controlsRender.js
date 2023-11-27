const player1 = `<div class="controlsBox"
>
<div class="controlsRow">
   <h3 class="key">Jump</h3>
   <h3 class="value">W</h3>
</div>

<div class="controlsRow">
 <h3 class="key">Left</h3>
 <h3 class="value">A</h3>
</div> 

<div class="controlsRow">
 <h3 class="key">Right</h3>
 <h3 class="value">D</h3>
</div>

<div class="controlsRow">
 <h3 class="key">Light Attack</h3>
 <h3 class="value">Space</h3>
</div>


<div class="controlsRow">
 <h3 class="key">Heavy Attack</h3>
 <h3 class="value">Q</h3>
</div>

<div class="controlsRow">
 <h3 class="key">Special Attack</h3>
 <h3 class="value">R</h3>
</div>


<div class="controlsRow">
 <h3 class="key">Block</h3>
 <h3 class="value">E</h3>
</div>

</div>`;

const player2 = `<div class="controlsBox"
>
<div class="controlsRow">
   <h3 class="key">Jump</h3>
   <h3 class="value">Arrow Up</h3>
</div>

<div class="controlsRow">
 <h3 class="key">Left</h3>
 <h3 class="value">Arrow Left</h3>
</div> 

<div class="controlsRow">
 <h3 class="key">Right</h3>
 <h3 class="value">Arrow Right</h3>
</div>

<div class="controlsRow">
 <h3 class="key">Light Attack</h3>
 <h3 class="value">Ctrl</h3>
</div>


<div class="controlsRow">
 <h3 class="key">Heavy Attack</h3>
 <h3 class="value">0</h3>
</div>

<div class="controlsRow">
 <h3 class="key">Special Attack</h3>
 <h3 class="value">2</h3>
</div>


<div class="controlsRow">
 <h3 class="key">Block</h3>
 <h3 class="value">1</h3>
</div>

</div>`;
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);

$(document).ready(() => {
  if (detectMobile()) return $(".selectContainer").css("display", "flex");
  $("#controls").append(
    urlParams.has("online") || !urlParams.has("p1") ? player1 : player2
  );
});
