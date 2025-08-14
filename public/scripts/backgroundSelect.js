$(document).ready(() => {
  // TODO: populate dynamically from server; for now, assume some filenames
  const candidates = ["Ruins.jpg", "Konoha.jpg", "Capsule corp.jpg"];
  const base = "../backgrounds/";

  const $grid = $("#bgGrid");
  candidates.forEach((name) => {
    const src = base + name;
    const $item = $(
      '<div class="characterBox" style="cursor:pointer;width:200px">\
      <img class="characterImage" style="width:100%;height:120px;object-fit:cover" loading="lazy" />\
      <div style="margin-top:8px;text-align:center;color:#e6edf3;font-weight:600"></div>\
    </div>'
    );
    $item.find("img").attr("src", src).attr("alt", name);
    $item.find("div").text(name.split(".")[0]);
    $item.on("click", () => {
      try {
        sessionStorage.setItem("axf_bg", src);
      } catch {}
      // Continue offline flow to game with chosen bg
      const params = new URLSearchParams(window.location.search);
      const p1 = params.get("p1");
      const p2 = params.get("p2");
      const qs = `?p1=${p1}&p2=${p2}`;
      window.location.href = `./game.html${qs}`;
    });
    $grid.append($item);
  });
});
