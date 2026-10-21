
async function loadMatches() {
  const request = ++requestNumber;

  currentView = "matches";
  $("sectionTitle").textContent = "Live Football Matches";
  $("matchesTab").classList.add("active");
  $("standingsTab").classList.remove("active");

  setMessage("Checking live football matches...");
  $("loadButton").disabled = true;

  try {
    // Fetch live matches across competitions available to your plan.
    const data = await apiGet("/matches?status=IN_PLAY");

    if (request !== requestNumber) return;

    renderMatches(data);

    setMessage(
      data.matches && data.matches.length
        ? "Live matches loaded. Last checked: " +
          new Date().toLocaleTimeString()
        : "No IN_PLAY matches were returned. There may be no current matches, or your plan may limit the available data."
    );
  } catch (error) {
    if (request !== requestNumber) return;

    setMessage("Unable to load live scores: " + error.message);
  } finally {
    if (request === requestNumber) {
      $("loadButton").disabled = false;
    }
  }
}

// Refresh live scores every 60 seconds.
setInterval(() => {
  if (getToken() && currentView === "matches") {
    loadMatches();
  }
}, 60000);
