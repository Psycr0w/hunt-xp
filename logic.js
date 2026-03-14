// ---------- grab DOM elements ----------

const hunterInput = document.getElementById("hunterLevel")
const bloodlineInput = document.getElementById("bloodlineLevel")

const hunterOutput = document.getElementById("hunterOutput")
const bloodlineOutput = document.getElementById("bloodlineOutput")


// ---------- helpers ----------

function remainingHunterXP(level) {

  if (!level) return 0

  let rest = 0

  for (let i = level + 1; i <= 50; i++) {
    rest += data.hunterXp[i]
  }

  return rest
}


function remainingBloodlineXP(level) {

  if (!level) return 0

  let rest = 0

  for (let i = level + 1; i <= 100; i++) {
    rest += data.bloodlineXp[i]
  }

  return rest
}


function sortedActions() {

  return Object.entries(data.xpList)
    .sort((a, b) => a[1] - b[1])

}


function fullHunterAward() {

  const keys = [4, 9, 13, 26, 34, 42, 50]

  let total = 0

  for (const k of keys) {
    total += data.bloodlineActions[k]
  }

  return total

}


// ---------- table builders ----------

function buildHunterTable(restXP) {

  let output = restXP.toLocaleString() + " xp to go\n\n"

  output += "Action".padEnd(18) + "XP".padStart(8) + "#".padStart(8) + "\n"
  output += "-".repeat(36) + "\n"

  for (const [name, xp] of sortedActions()) {

    const count = xp ? Math.ceil(restXP / xp) : ""

    output +=
      name.padEnd(18) +
      xp.toString().padStart(8) +
      count.toString().padStart(8) +
      "\n"
  }

  return output

}


function buildBloodlineTable(restXP) {

  let output = restXP.toLocaleString() + " xp to go\n\n"

  output += "Bloodline Action".padEnd(22) + "XP".padStart(8) + "#".padStart(8) + "\n"
  output += "-".repeat(40) + "\n"

  const full = fullHunterAward()

  output +=
    "lvl 50 Hunter".padEnd(22) +
    full.toString().padStart(8) +
    Math.ceil(restXP / full).toString().padStart(8) +
    "\n"

  const retirement = data.bloodlineActions["Retirement"]

  output +=
    "Old Folks Home".padEnd(22) +
    retirement.toString().padStart(8) +
    Math.ceil(restXP / retirement).toString().padStart(8) +
    "\n"

  const poster = data.bloodlineActions["Poster"]

  output +=
    "Poster".padEnd(22) +
    poster.toString().padStart(8) +
    Math.ceil(restXP / poster).toString().padStart(8) +
    "\n"

  output += "\n"

  for (const [name, xp] of sortedActions()) {

    const count = xp ? Math.ceil(restXP / xp) : ""

    output +=
      name.padEnd(22) +
      xp.toString().padStart(8) +
      count.toString().padStart(8) +
      "\n"
  }

  return output

}


// ---------- main update ----------

function update() {

  const hunterLevel = parseInt(hunterInput.value) || 0
  const bloodlineLevel = parseInt(bloodlineInput.value) || 0

  const hunterRest = remainingHunterXP(hunterLevel)
  const bloodRest = remainingBloodlineXP(bloodlineLevel)

  hunterOutput.textContent = buildHunterTable(hunterRest)
  bloodlineOutput.textContent = buildBloodlineTable(bloodRest)

}


// ---------- number input control ----------

function adjustValue(input, delta) {

  let value = parseInt(input.value || 0) + delta

  const min = parseInt(input.min)
  const max = parseInt(input.max)

  if (!isNaN(min)) value = Math.max(value, min)
  if (!isNaN(max)) value = Math.min(value, max)

  input.value = value

  input.dispatchEvent(new Event("input"))

}


// button controls

document.querySelectorAll(".number-input button").forEach(btn => {

  const input = document.getElementById(btn.dataset.target)

  const direction = btn.classList.contains("plus") ? 1 : -1

  let interval


  const step = (event) => {

    let multiplier = 1

    if (event.ctrlKey) multiplier = 10
    else if (event.shiftKey) multiplier = 5

    adjustValue(input, direction * multiplier)

  }


  btn.addEventListener("mousedown", (e) => {

    step(e)

    interval = setInterval(() => step(e), 120)

  })


  btn.addEventListener("mouseup", () => clearInterval(interval))
  btn.addEventListener("mouseleave", () => clearInterval(interval))

})


// keyboard controls

document.querySelectorAll(".number-input input").forEach(input => {

  input.addEventListener("keydown", (e) => {

    let multiplier = 1

    if (e.ctrlKey) multiplier = 10
    else if (e.shiftKey) multiplier = 5

    if (e.key === "ArrowUp") {

      adjustValue(input, multiplier)
      e.preventDefault()

    }

    if (e.key === "ArrowDown") {

      adjustValue(input, -multiplier)
      e.preventDefault()

    }

  })

})


// ---------- event listeners ----------

hunterInput.addEventListener("input", update)
bloodlineInput.addEventListener("input", update)


// ---------- initial render ----------

update()
