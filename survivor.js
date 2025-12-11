// === TEAM LIST ===
const TEAMS = [
  "Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills",
  "Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns",
  "Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers",
  "Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs",
  "Las Vegas Raiders","Los Angeles Chargers","Los Angeles Rams","Miami Dolphins",
  "Minnesota Vikings","New England Patriots","New Orleans Saints",
  "New York Giants","New York Jets","Philadelphia Eagles","Pittsburgh Steelers",
  "San Francisco 49ers","Seattle Seahawks","Tampa Bay Buccaneers",
  "Tennessee Titans","Washington Commanders"
];

const STORAGE_KEY = "nasty_survivor_picks_v1";

const form = document.getElementById("survivorForm");
const emailInput = document.getElementById("playerEmail");
const teamSelect = document.getElementById("teamSelect");
const usedTeamsText = document.getElementById("usedTeamsText");
const usedTeamsList = document.getElementById("usedTeamsList");
const statusMessage = document.getElementById("statusMessage");

// Local Storage Helpers
function loadPicks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}
function savePicks(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function getUser(email) {
  const all = loadPicks();
  return all[email] || { picks: [], weeks: {} };
}
function saveUserPick(email, week, team) {
  const all = loadPicks();
  if (!all[email]) all[email] = { picks: [], weeks: {} };
  if (!all[email].picks.includes(team)) all[email].picks.push(team);
  all[email].weeks[week] = team;
  savePicks(all);
}

// Load teams based on email
function populateTeams(email) {
  const user = getUser(email);
  const used = new Set(user.picks);

  teamSelect.innerHTML = "";
  const def = document.createElement("option");
  def.value = "";
  def.disabled = true;
  def.selected = true;
  def.textContent = "Select a team";
  teamSelect.appendChild(def);

  TEAMS.forEach(team => {
    if (!used.has(team)) {
      const opt = document.createElement("option");
      opt.value = team;
      opt.textContent = team;
      teamSelect.appendChild(opt);
    }
  });

  teamSelect.disabled = false;

  if (user.picks.length > 0) {
    usedTeamsText.style.display = "block";
    usedTeamsList.textContent = user.picks.join(", ");
  } else {
    usedTeamsText.style.display = "none";
  }
}

emailInput.addEventListener("blur", () => {
  const email = emailInput.value.trim().toLowerCase();
  if (email) populateTeams(email);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("playerName").value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const week = document.getElementById("weekNumber").value;
  const team = teamSelect.value;

  if (!name || !email || !week || !team) {
    statusMessage.textContent = "Please fill all fields.";
    statusMessage.style.color = "red";
    return;
  }

  const user = getUser(email);

  if (user.picks.includes(team)) {
    statusMessage.textContent = "You've already used that team.";
    statusMessage.style.color = "red";
    return;
  }

  if (user.weeks[week]) {
    statusMessage.textContent = `You've already picked a team for ${week}.`;
    statusMessage.style.color = "red";
    return;
  }

  saveUserPick(email, week, team);

  statusMessage.textContent = `Pick submitted: ${team} for ${week}!`;
  statusMessage.style.color = "green";

  populateTeams(email);
});
