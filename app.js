(() => {
  "use strict";

  const STORAGE_KEY = "cyberchoices:v1";
  const campaigns = Array.isArray(window.CYBER_CAMPAIGNS) ? window.CYBER_CAMPAIGNS : [];
  const app = document.querySelector("#app");
  const announcer = document.querySelector("#announcer");
  const savedStatus = document.querySelector("#saved-status");

  const defaultStore = () => ({ best: {}, active: null, playerName: "" });

  function loadStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== "object") return defaultStore();
      return {
        best: saved.best && typeof saved.best === "object" ? saved.best : {},
        active: saved.active && typeof saved.active === "object" ? saved.active : null,
        playerName: typeof saved.playerName === "string" ? saved.playerName.slice(0, 32) : ""
      };
    } catch {
      return defaultStore();
    }
  }

  let store = loadStore();
  let view = "home";
  let selectedDistrict = null;
  let travelTimer = null;
  let editingName = false;
  let lockedNotice = null;
  let playerIntroduced = false;

  const districtPositions = {
    bank: { left: "25%", top: "53%" },
    medical: { left: "50%", top: "38%" },
    government: { left: "81%", top: "52%" },
    plaza: { left: "50%", top: "73%" }
  };

  function saveStore(message = "Progress saved") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      savedStatus.textContent = message;
      savedStatus.classList.add("is-visible");
      window.setTimeout(() => savedStatus.classList.remove("is-visible"), 1400);
    } catch {
      savedStatus.textContent = "Progress is available for this session";
      savedStatus.classList.add("is-visible");
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getCampaign(id) {
    return campaigns.find((campaign) => campaign.id === id);
  }

  function currentCampaign() {
    return store.active ? getCampaign(store.active.scenarioId) : null;
  }

  function unmetCampaignPrerequisite(scenarioId) {
    const campaignIndex = campaigns.findIndex((campaign) => campaign.id === scenarioId);
    if (campaignIndex <= 0 || store.best[scenarioId] || store.active?.scenarioId === scenarioId) return null;
    return campaigns.slice(0, campaignIndex).find((campaign) => !store.best[campaign.id]) || null;
  }

  function orderedChoices(campaign, level) {
    const sourceIndexes = level.choices.map((_, index) => index);
    const strongSourceIndex = level.choices.findIndex((choice) => choice.verdict === "strong");
    if (strongSourceIndex < 0) {
      return sourceIndexes.map((sourceIndex) => ({ sourceIndex, choice: level.choices[sourceIndex] }));
    }

    const campaignIndex = Math.max(0, campaigns.findIndex((item) => item.id === campaign.id));
    const desiredPosition = (campaignIndex + level.number) % sourceIndexes.length;
    const currentPosition = sourceIndexes.indexOf(strongSourceIndex);
    [sourceIndexes[currentPosition], sourceIndexes[desiredPosition]] = [sourceIndexes[desiredPosition], sourceIndexes[currentPosition]];
    return sourceIndexes.map((sourceIndex) => ({ sourceIndex, choice: level.choices[sourceIndex] }));
  }

  function announce(message) {
    announcer.textContent = "";
    window.setTimeout(() => {
      announcer.textContent = message;
    }, 30);
  }

  function outcomeFor(score) {
    if (score >= 90) {
      return {
        title: "Cyber Defender",
        tone: "strong",
        summary: "You protected the organization with consistent, well-coordinated security decisions."
      };
    }
    if (score >= 70) {
      return {
        title: "Incident Contained",
        tone: "contained",
        summary: "The attack created risk, but your response prevented the situation from becoming a major breach."
      };
    }
    if (score >= 40) {
      return {
        title: "Partial Breach",
        tone: "partial",
        summary: "Some information or systems were exposed. Review the missed warning signs before your next mission."
      };
    }
    return {
      title: "Major Cyberattack",
      tone: "risk",
      summary: "The organization suffered serious impact. Replay the campaign and use the evidence to make safer choices."
    };
  }

  function difficultyMarkup(difficulty) {
    return `<span class="difficulty difficulty-${difficulty.toLowerCase()}">${escapeHTML(difficulty)}</span>`;
  }

  function renderHome() {
    const completedCount = Object.keys(store.best).filter((id) => store.best[id]).length;
    const totalMissions = campaigns.reduce((sum, campaign) => sum + campaign.levels.length, 0);
    const activeCampaign = currentCampaign();
    const activeLevel = store.active ? store.active.levelIndex + 1 : 0;
    const selectedCampaign = getCampaign(selectedDistrict);
    const blockedCampaign = lockedNotice ? getCampaign(lockedNotice.scenarioId) : null;
    const requiredCampaign = lockedNotice ? getCampaign(lockedNotice.prerequisiteId) : null;
    const operatorPosition = selectedCampaign ? districtPositions[selectedCampaign.id] : districtPositions.plaza;
    const savedPlayerName = store.playerName.trim();
    const showNamePrompt = !playerIntroduced || editingName;

    app.innerHTML = `
      <section class="home-view">
        <div class="mission-header">
          <div class="mission-copy">
            <span class="eyebrow">Interactive cybersecurity training</span>
            <h1>Choose carefully. Every response changes the outcome.</h1>
            <p>Join the Cyber Response Unit and protect three organizations through realistic, decision-based incidents.</p>
            <div class="hero-signals" aria-label="Game features">
              <span><i aria-hidden="true"></i>Branching decisions</span>
              <span><i aria-hidden="true"></i>Real-world threats</span>
              <span><i aria-hidden="true"></i>Instant feedback</span>
            </div>
          </div>
          <div class="command-deck" aria-label="Operator progress">
            <div class="command-deck-top">
              <span class="system-state"><i aria-hidden="true"></i>System online</span>
              <span>CRU // OPERATOR 01</span>
            </div>
            <div class="command-core">
              <div class="completion-orbit">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle class="orbit-track" cx="60" cy="60" r="49"></circle>
                  <circle
                    class="orbit-value"
                    cx="60"
                    cy="60"
                    r="49"
                    style="stroke-dashoffset: ${307.88 * (1 - completedCount / 3)}"
                  ></circle>
                </svg>
                <div><strong>${completedCount}</strong><span>of 3</span></div>
              </div>
              <div class="command-copy">
                <span>Current clearance</span>
                <strong>${completedCount === 3 ? "Cross-Sector Defender" : completedCount === 0 ? "Recruit" : "Response Specialist"}</strong>
                <small>${completedCount === 3 ? "All campaigns secured" : `${3 - completedCount} campaign${3 - completedCount === 1 ? "" : "s"} remaining`}</small>
              </div>
            </div>
            <div class="command-stats">
              <div><strong>${campaigns.length}</strong><span>Sectors</span></div>
              <div><strong>${totalMissions}</strong><span>Missions</span></div>
              <div><strong>3</strong><span>Endings+</span></div>
            </div>
          </div>
        </div>

        ${activeCampaign ? `
          <aside class="resume-panel" data-accent="${activeCampaign.accent}">
            <div class="sector-symbol" aria-hidden="true">${escapeHTML(activeCampaign.shortCode)}</div>
            <div>
              <span class="eyebrow">Mission in progress</span>
              <strong>${escapeHTML(activeCampaign.organization)} · Level ${activeLevel} of 5</strong>
              <span>${store.active.score} security points earned</span>
            </div>
            <button class="button button-primary" type="button" data-action="continue">Continue mission</button>
          </aside>
        ` : ""}

        <div class="section-heading neighborhood-heading">
          <div>
            <span class="eyebrow">Cyber Response District</span>
            <h2>Choose a destination and enter the campaign.</h2>
          </div>
          ${completedCount === 3 ? '<span class="completion-banner">Cross-Sector Defender unlocked</span>' : ""}
        </div>

        <div class="neighborhood-shell ${selectedCampaign ? "has-selection" : ""} ${showNamePrompt ? "is-onboarding" : ""}" data-selected="${selectedDistrict || "none"}">
          <div class="map-stage">
            <img class="neighborhood-art" src="cyber-neighborhood.png" alt="Futuristic neighborhood with a bank, medical center, and government building surrounding a central plaza" />
            <div class="map-vignette" aria-hidden="true"></div>

            <div class="district-ribbon">
              <span>Cyber Response District</span>
              <strong>${showNamePrompt ? "Recruit onboarding" : `Operator ${escapeHTML(savedPlayerName)}`}</strong>
            </div>

            ${!showNamePrompt ? `
              <div class="player-chip">
                <span><small>Active operator</small><strong>${escapeHTML(savedPlayerName)}</strong></span>
                <button type="button" data-action="edit-name">Change</button>
              </div>
            ` : ""}

            ${campaigns.map((campaign, index) => {
              const best = store.best[campaign.id];
              const isActive = store.active && store.active.scenarioId === campaign.id;
              const isLocked = Boolean(unmetCampaignPrerequisite(campaign.id));
              return `
                <button
                  class="map-hotspot hotspot-${campaign.id} ${selectedDistrict === campaign.id ? "is-selected" : ""} ${isLocked ? "is-locked" : ""}"
                  type="button"
                  data-action="visit"
                  data-scenario="${campaign.id}"
                  aria-label="${isLocked ? "Locked campaign" : "Visit"} ${escapeHTML(campaign.organization)}"
                  ${showNamePrompt ? "disabled" : ""}
                >
                  <span class="hotspot-beacon" aria-hidden="true"><i></i></span>
                  <span class="hotspot-label" data-accent="${campaign.accent}">
                    <small>Campaign 0${index + 1} · ${best ? "Secured" : isActive ? "In progress" : isLocked ? "Locked" : "Available"}</small>
                    <strong>${escapeHTML(campaign.organization)}</strong>
                    <em>${isLocked ? "LOCK" : escapeHTML(campaign.shortCode)}</em>
                  </span>
                </button>
              `;
            }).join("")}

            <img
              class="operator-avatar ${selectedCampaign ? "at-destination" : ""}"
              src="operator-avatar.png"
              alt="Cyber Response Unit operator"
              style="--operator-left: ${operatorPosition.left}; --operator-top: ${operatorPosition.top};"
            />

            ${showNamePrompt ? `
              <aside class="operator-introduction" aria-labelledby="operator-intro-title">
                <div class="intro-speaker">
                  <span class="speaker-code">NOVA // CRU GUIDE</span>
                  <span class="speaker-live"><i aria-hidden="true"></i>Live</span>
                </div>
                <h2 id="operator-intro-title">Hi, I’m Nova.</h2>
                <p>I’ll guide you through the district and help you investigate each cyber incident. Before we begin, what should I call you?</p>
                <form class="name-form" id="player-name-form">
                  <label for="player-name">Your name</label>
                  <div class="name-entry">
                    <input
                      id="player-name"
                      name="playerName"
                      type="text"
                      maxlength="32"
                      autocomplete="given-name"
                      value="${editingName ? escapeHTML(savedPlayerName) : ""}"
                      placeholder="Enter your name"
                      required
                    />
                    <button class="button button-primary" type="submit">Join the unit</button>
                  </div>
                  ${editingName ? '<button class="cancel-name-edit" type="button" data-action="cancel-name-edit">Keep current name</button>' : ""}
                </form>
              </aside>
            ` : `
              <div class="map-instruction ${selectedCampaign ? "is-hidden" : ""}">
                <span class="map-key" aria-hidden="true">01</span>
                <p><strong>Welcome, ${escapeHTML(savedPlayerName)}.</strong> Select a building and walk to your first assignment.</p>
              </div>
            `}

            ${blockedCampaign && requiredCampaign ? `
              <aside class="lock-notice" role="alert" aria-labelledby="lock-notice-title">
                <button class="brief-close" type="button" data-action="close-lock-notice" aria-label="Close locked campaign notice">×</button>
                <span class="lock-code">Access denied // Campaign locked</span>
                <h2 id="lock-notice-title">Complete the previous campaign first</h2>
                <p>To access <strong>${escapeHTML(blockedCampaign.name)}</strong> and its levels, first complete <strong>${escapeHTML(requiredCampaign.name)}</strong>.</p>
                <button class="button button-primary" type="button" data-action="close-lock-notice">Got it</button>
              </aside>
            ` : ""}

            ${selectedCampaign ? (() => {
              const best = store.best[selectedCampaign.id];
              const isActive = store.active && store.active.scenarioId === selectedCampaign.id;
              return `
                <aside class="district-brief" data-accent="${selectedCampaign.accent}">
                  <button class="brief-close" type="button" data-action="close-brief" aria-label="Close campaign briefing">×</button>
                  <div class="brief-topline">
                    <span class="sector-symbol" aria-hidden="true">${escapeHTML(selectedCampaign.shortCode)}</span>
                    <div><small>Field assignment</small><strong>${escapeHTML(selectedCampaign.role)}</strong></div>
                  </div>
                  <span class="eyebrow">${escapeHTML(selectedCampaign.organization)}</span>
                  <h3>${escapeHTML(selectedCampaign.name)} Campaign</h3>
                  <p>${escapeHTML(selectedCampaign.description)}</p>
                  <div class="brief-difficulty" aria-label="Campaign difficulty progression">
                    ${selectedCampaign.levels.map((level, index) => `<span><b>${index + 1}</b><small>${escapeHTML(level.difficulty)}</small></span>`).join("")}
                  </div>
                  <div class="brief-footer">
                    <span>${best ? `Best score ${best.score}/100` : `Badge: ${escapeHTML(selectedCampaign.badge)}`}</span>
                    <button
                      class="button button-primary"
                      type="button"
                      data-action="${isActive ? "continue" : "start"}"
                      data-scenario="${selectedCampaign.id}"
                    >${isActive ? "Continue inside" : best ? "Re-enter campaign" : "Enter campaign"}</button>
                  </div>
                </aside>
              `;
            })() : ""}
          </div>
        </div>

        <div class="section-heading progress-heading">
          <div>
            <span class="eyebrow">Campaign progress</span>
            <h2>Your Cyber Response Unit record</h2>
          </div>
          ${completedCount === 3 ? '<span class="completion-banner">Cross-Sector Defender unlocked</span>' : ""}
        </div>
      </section>
    `;

    const home = app.querySelector(".home-view");
    const missionHeader = home?.querySelector(".mission-header");
    const neighborhood = home?.querySelector(".neighborhood-shell");
    const campaignProgress = home?.querySelector(".command-deck");
    const progressHeading = home?.querySelector(".progress-heading");
    const redundantHeading = home?.querySelector(".neighborhood-heading");
    if (missionHeader && neighborhood) missionHeader.insertAdjacentElement("afterend", neighborhood);
    if (progressHeading && campaignProgress) progressHeading.insertAdjacentElement("afterend", campaignProgress);
    redundantHeading?.remove();
  }

  function progressMarkup(campaign, levelIndex) {
    return `
      <div class="level-progress" aria-label="Campaign progress: level ${levelIndex + 1} of ${campaign.levels.length}">
        ${campaign.levels.map((level, index) => `
          <span class="progress-step ${index < levelIndex ? "is-done" : index === levelIndex ? "is-current" : ""}">
            <b>${index + 1}</b>
            <small>${escapeHTML(level.difficulty)}</small>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderLevel() {
    const campaign = currentCampaign();
    if (!campaign || !store.active) {
      view = "home";
      render();
      return;
    }

    const level = campaign.levels[store.active.levelIndex];
    const scannedEvidence = Array.isArray(store.active.scannedEvidence) ? store.active.scannedEvidence : [];
    const allEvidenceScanned = scannedEvidence.length === level.evidence.length;
    app.innerHTML = `
      <section class="game-view" data-accent="${campaign.accent}">
        <div class="game-heading">
          <button class="text-button" type="button" data-action="home">Campaigns</button>
          <div class="game-heading-main">
            <div>
              <span class="eyebrow">${escapeHTML(campaign.organization)} · Operator ${escapeHTML(store.playerName)}</span>
              <h1>Level ${level.number}: ${escapeHTML(level.title)}</h1>
            </div>
            <div class="score-card">
              <span>Security score</span>
              <strong>${store.active.score}<small>/100</small></strong>
            </div>
          </div>
          ${progressMarkup(campaign, store.active.levelIndex)}
        </div>

        <div class="game-layout">
          <aside class="incident-rail">
            <div class="incident-kicker">
              <span class="pulse-dot" aria-hidden="true"></span>
              Active incident
            </div>
            <dl>
              <div><dt>Difficulty</dt><dd>${difficultyMarkup(level.difficulty)}</dd></div>
              <div><dt>Reported</dt><dd>${escapeHTML(level.time)}</dd></div>
              <div><dt>Channel</dt><dd>${escapeHTML(level.channel)}</dd></div>
            </dl>
            <div class="rail-note">
              <strong>Your objective</strong>
              <p>Protect people, data, and operations using the evidence available.</p>
            </div>
          </aside>

          <div class="decision-panel">
            <div class="briefing-block">
              <span class="eyebrow">Incident briefing</span>
              <p class="brief-text">${escapeHTML(level.brief)}</p>
            </div>

            <div class="evidence-header">
              <div><span class="eyebrow">Evidence scan</span><strong>Inspect every signal before responding.</strong></div>
              <span class="evidence-count" id="evidence-count">${scannedEvidence.length}/${level.evidence.length} analyzed</span>
            </div>
            <div class="evidence-grid">
              ${level.evidence.map((item, index) => `
                <button
                  class="evidence-item ${scannedEvidence.includes(index) ? "is-scanned" : ""}"
                  type="button"
                  data-action="scan"
                  data-evidence="${index}"
                  aria-label="Analyze ${escapeHTML(item.label)}"
                >
                  <span class="evidence-label">${escapeHTML(item.label)}</span>
                  <strong class="evidence-value">${scannedEvidence.includes(index) ? escapeHTML(item.value) : "Signal concealed"}</strong>
                  <span class="evidence-scan-state">${scannedEvidence.includes(index) ? "Analyzed ✓" : "Select to analyze"}</span>
                </button>
              `).join("")}
            </div>

            <fieldset class="choice-set ${allEvidenceScanned ? "" : "is-locked"}">
              <legend>${escapeHTML(level.question)}</legend>
              <p id="choice-help">${allEvidenceScanned ? "Select the response you would take. You cannot change it after submitting." : "Analyze all three pieces of evidence to unlock your response options."}</p>
              <div class="choice-list">
                ${orderedChoices(campaign, level).map(({ choice, sourceIndex }, displayIndex) => `
                  <button class="choice-card" type="button" data-action="choose" data-choice="${sourceIndex}" ${allEvidenceScanned ? "" : "disabled"}>
                    <span class="choice-key">${String.fromCharCode(65 + displayIndex)}</span>
                    <span>
                      <strong>${escapeHTML(choice.title)}</strong>
                      <small>${escapeHTML(choice.detail)}</small>
                    </span>
                  </button>
                `).join("")}
              </div>
            </fieldset>
          </div>
        </div>
      </section>
    `;
  }

  function renderFeedback() {
    const campaign = currentCampaign();
    if (!campaign || !store.active) {
      view = "home";
      render();
      return;
    }

    const answer = store.active.answers[store.active.answers.length - 1];
    const level = campaign.levels[store.active.levelIndex];
    const choice = level.choices[answer.choiceIndex];
    const verdictLabel = choice.verdict === "strong" ? "Strong response" : choice.verdict === "partial" ? "Partially secure" : "High-risk response";
    const isLast = store.active.levelIndex === campaign.levels.length - 1;

    app.innerHTML = `
      <section class="feedback-view" data-accent="${campaign.accent}">
        <div class="feedback-shell">
          <div class="feedback-topline">
            <span>${escapeHTML(campaign.organization)} · Level ${level.number} of 5</span>
            <span class="score-earned score-${choice.verdict}">+${choice.score} points</span>
          </div>
          <div class="verdict-mark verdict-${choice.verdict}" aria-hidden="true">
            ${choice.verdict === "strong" ? "✓" : choice.verdict === "partial" ? "!" : "×"}
          </div>
          <span class="verdict-label verdict-text-${choice.verdict}">${verdictLabel}</span>
          <h1>${escapeHTML(choice.title)}</h1>
          <p class="impact-copy">${escapeHTML(choice.impact)}</p>

          <div class="lesson-card">
            <span>What to remember</span>
            <p>${escapeHTML(choice.lesson)}</p>
          </div>

          <div class="feedback-actions">
            <div class="running-score">
              <span>Current security score</span>
              <strong>${store.active.score}<small>/100</small></strong>
            </div>
            <button class="button button-primary" type="button" data-action="next">
              ${isLast ? "View campaign result" : `Continue to level ${level.number + 1}`}
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function renderResults() {
    const campaign = currentCampaign();
    if (!campaign || !store.active) {
      view = "home";
      render();
      return;
    }

    const outcome = outcomeFor(store.active.score);
    const strongCount = store.active.answers.filter((answer) => answer.verdict === "strong").length;

    app.innerHTML = `
      <section class="results-view" data-accent="${campaign.accent}">
        <div class="result-summary">
          <div class="result-sector">${escapeHTML(campaign.shortCode)}</div>
          <span class="eyebrow">Operator ${escapeHTML(store.playerName)} · Campaign complete</span>
          <h1>${escapeHTML(outcome.title)}</h1>
          <p>${escapeHTML(outcome.summary)}</p>

          <div class="final-score score-tone-${outcome.tone}">
            <strong>${store.active.score}</strong>
            <span>Security score<br />out of 100</span>
          </div>

          <div class="result-metrics">
            <div><strong>${strongCount}/5</strong><span>Strong responses</span></div>
            <div><strong>${campaign.badge}</strong><span>${store.active.score >= 70 ? "Badge earned" : "Replay to earn"}</span></div>
          </div>
        </div>

        <div class="response-review">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Decision review</span>
              <h2>Your five responses</h2>
            </div>
          </div>
          <ol class="review-list">
            ${store.active.answers.map((answer, index) => {
              const level = campaign.levels[index];
              const choice = level.choices[answer.choiceIndex];
              return `
                <li>
                  <span class="review-icon verdict-${answer.verdict}">${answer.verdict === "strong" ? "✓" : answer.verdict === "partial" ? "!" : "×"}</span>
                  <div>
                    <small>Level ${index + 1} · ${escapeHTML(level.difficulty)}</small>
                    <strong>${escapeHTML(level.title)}</strong>
                    <span>${escapeHTML(choice.title)}</span>
                  </div>
                  <b>+${answer.score}</b>
                </li>
              `;
            }).join("")}
          </ol>
          <div class="result-actions">
            <button class="button button-secondary" type="button" data-action="replay">Replay campaign</button>
            <button class="button button-primary" type="button" data-action="finish">Choose another campaign</button>
          </div>
        </div>
      </section>
    `;
  }

  function render() {
    if (view === "level") renderLevel();
    else if (view === "feedback") renderFeedback();
    else if (view === "results") renderResults();
    else renderHome();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setPlayerName(value) {
    const name = String(value || "").trim().replace(/\s+/g, " ").slice(0, 32);
    if (!name) return false;
    store.playerName = name;
    playerIntroduced = true;
    editingName = false;
    selectedDistrict = null;
    lockedNotice = null;
    saveStore(`Welcome, ${name}`);
    renderHome();
    announce(`Welcome to the Cyber Response Unit, ${name}. Choose a campaign building.`);
    return true;
  }

  function visitCampaign(scenarioId) {
    const campaign = getCampaign(scenarioId);
    const prerequisite = unmetCampaignPrerequisite(scenarioId);
    if (campaign && prerequisite) {
      selectedDistrict = null;
      lockedNotice = { scenarioId, prerequisiteId: prerequisite.id };
      renderHome();
      announce(`${campaign.name} is locked. Complete ${prerequisite.name} first.`);
      return false;
    }
    const position = districtPositions[scenarioId];
    const avatar = document.querySelector(".operator-avatar");
    const map = document.querySelector(".neighborhood-shell");
    if (!store.playerName.trim() || !campaign || !position || !avatar || !map) return false;

    lockedNotice = null;

    window.clearTimeout(travelTimer);
    map.classList.add("is-traveling");
    document.querySelectorAll(".map-hotspot").forEach((button) => {
      button.disabled = true;
      button.classList.toggle("is-destination", button.dataset.scenario === scenarioId);
    });
    avatar.style.setProperty("--operator-left", position.left);
    avatar.style.setProperty("--operator-top", position.top);
    avatar.classList.add("is-walking");
    announce(`Walking to ${campaign.organization}.`);

    const travelTime = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 80 : 1050;
    travelTimer = window.setTimeout(() => {
      selectedDistrict = scenarioId;
      renderHome();
      announce(`${campaign.name} campaign briefing opened.`);
    }, travelTime);
    return true;
  }

  function scanEvidence(evidenceIndex) {
    const campaign = currentCampaign();
    if (!campaign || !store.active || store.active.phase !== "level") return false;
    const level = campaign.levels[store.active.levelIndex];
    if (!level.evidence[evidenceIndex]) return false;
    if (!Array.isArray(store.active.scannedEvidence)) store.active.scannedEvidence = [];
    if (store.active.scannedEvidence.includes(evidenceIndex)) return true;

    store.active.scannedEvidence.push(evidenceIndex);
    saveStore("Evidence analyzed");

    const evidenceButton = document.querySelector(`[data-action="scan"][data-evidence="${evidenceIndex}"]`);
    if (evidenceButton) {
      evidenceButton.classList.add("is-scanned");
      evidenceButton.querySelector(".evidence-value").textContent = level.evidence[evidenceIndex].value;
      evidenceButton.querySelector(".evidence-scan-state").textContent = "Analyzed ✓";
    }

    const count = store.active.scannedEvidence.length;
    const countLabel = document.querySelector("#evidence-count");
    if (countLabel) countLabel.textContent = `${count}/${level.evidence.length} analyzed`;
    announce(`Evidence ${count} of ${level.evidence.length} analyzed.`);

    if (count === level.evidence.length) {
      const choiceSet = document.querySelector(".choice-set");
      choiceSet?.classList.remove("is-locked");
      choiceSet?.querySelectorAll(".choice-card").forEach((button) => {
        button.disabled = false;
      });
      const help = document.querySelector("#choice-help");
      if (help) help.textContent = "Select the response you would take. You cannot change it after submitting.";
      announce("All evidence analyzed. Response options unlocked.");
    }
    return true;
  }

  function startCampaign(scenarioId) {
    const campaign = getCampaign(scenarioId);
    if (!store.playerName.trim() || !campaign) return false;
    const prerequisite = unmetCampaignPrerequisite(scenarioId);
    if (prerequisite) {
      selectedDistrict = null;
      lockedNotice = { scenarioId, prerequisiteId: prerequisite.id };
      view = "home";
      renderHome();
      announce(`${campaign.name} is locked. Complete ${prerequisite.name} first.`);
      return false;
    }
    if (store.active && store.active.scenarioId !== scenarioId && store.active.phase !== "results") {
      const replace = window.confirm("Starting a different campaign will replace your current mission progress. Continue?");
      if (!replace) return false;
    }
    store.active = {
      scenarioId,
      levelIndex: 0,
      score: 0,
      answers: [],
      scannedEvidence: [],
      phase: "level"
    };
    lockedNotice = null;
    view = "level";
    saveStore("Campaign started");
    render();
    announce(`${campaign.name} campaign started. Level 1.`);
    return true;
  }

  function chooseResponse(choiceIndex) {
    const campaign = currentCampaign();
    if (!campaign || !store.active || store.active.phase !== "level") return false;
    const level = campaign.levels[store.active.levelIndex];
    const choice = level.choices[choiceIndex];
    const scannedEvidence = Array.isArray(store.active.scannedEvidence) ? store.active.scannedEvidence : [];
    if (!choice || scannedEvidence.length !== level.evidence.length || store.active.answers.length > store.active.levelIndex) return false;

    store.active.score += choice.score;
    store.active.answers.push({
      level: level.number,
      choiceIndex,
      score: choice.score,
      verdict: choice.verdict
    });
    store.active.phase = "feedback";
    view = "feedback";
    saveStore();
    render();
    announce(`${choice.score} points earned. ${choice.verdict === "strong" ? "Strong response." : choice.verdict === "partial" ? "Partially secure response." : "High-risk response."}`);
    return true;
  }

  function advanceLevel() {
    const campaign = currentCampaign();
    if (!campaign || !store.active || store.active.phase !== "feedback") return;
    const isLast = store.active.levelIndex === campaign.levels.length - 1;

    if (isLast) {
      const outcome = outcomeFor(store.active.score);
      const previous = store.best[campaign.id];
      if (!previous || store.active.score > previous.score) {
        store.best[campaign.id] = {
          score: store.active.score,
          ending: outcome.title,
          completedAt: new Date().toISOString()
        };
      }
      store.active.phase = "results";
      view = "results";
      saveStore("Campaign complete");
      render();
      announce(`Campaign complete. ${outcome.title}. Score ${store.active.score} out of 100.`);
      return;
    }

    store.active.levelIndex += 1;
    store.active.scannedEvidence = [];
    store.active.phase = "level";
    view = "level";
    saveStore();
    render();
    announce(`Level ${store.active.levelIndex + 1} of 5.`);
  }

  function continueCampaign() {
    if (!store.active) return;
    view = store.active.phase || "level";
    render();
  }

  function finishCampaign() {
    store.active = null;
    selectedDistrict = null;
    lockedNotice = null;
    view = "home";
    saveStore();
    render();
  }

  function resetProgress() {
    const confirmed = window.confirm("Reset every campaign score and current mission? This cannot be undone.");
    if (!confirmed) return;
    store = defaultStore();
    selectedDistrict = null;
    editingName = false;
    lockedNotice = null;
    playerIntroduced = false;
    localStorage.removeItem(STORAGE_KEY);
    view = "home";
    render();
    announce("All CyberChoices progress has been reset.");
  }

  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const action = control.dataset.action;

    if (action === "home") {
      selectedDistrict = null;
      lockedNotice = null;
      view = "home";
      render();
    } else if (action === "reset") {
      resetProgress();
    } else if (action === "start") {
      startCampaign(control.dataset.scenario);
    } else if (action === "visit") {
      visitCampaign(control.dataset.scenario);
    } else if (action === "close-brief") {
      selectedDistrict = null;
      renderHome();
    } else if (action === "close-lock-notice") {
      lockedNotice = null;
      renderHome();
    } else if (action === "edit-name") {
      editingName = true;
      selectedDistrict = null;
      lockedNotice = null;
      renderHome();
    } else if (action === "cancel-name-edit") {
      editingName = false;
      renderHome();
    } else if (action === "continue") {
      continueCampaign();
    } else if (action === "scan") {
      scanEvidence(Number(control.dataset.evidence));
    } else if (action === "choose") {
      chooseResponse(Number(control.dataset.choice));
    } else if (action === "next") {
      advanceLevel();
    } else if (action === "replay") {
      const campaign = currentCampaign();
      if (campaign) startCampaign(campaign.id);
    } else if (action === "finish") {
      finishCampaign();
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id !== "player-name-form") return;
    event.preventDefault();
    const input = event.target.querySelector("#player-name");
    if (!setPlayerName(input?.value)) {
      input?.setCustomValidity("Please enter your name.");
      input?.reportValidity();
      input?.addEventListener("input", () => input.setCustomValidity(""), { once: true });
    }
  });

  function registerWebMCP() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
      } catch {
        // The visible game remains fully functional when WebMCP is unavailable.
      }
    };

    register({
      name: "get_campaign_status",
      title: "Get campaign status",
      description: "Read completed campaign scores and the current CyberChoices mission without changing game state.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        return {
          operator: store.playerName || null,
          completed: Object.entries(store.best).map(([id, result]) => ({ campaign: id, score: result.score, ending: result.ending })),
          active: store.active ? { campaign: store.active.scenarioId, level: store.active.levelIndex + 1, score: store.active.score, phase: store.active.phase } : null
        };
      }
    });

    register({
      name: "set_player_name",
      title: "Set player name",
      description: "Set the name shown for the CyberChoices operator and unlock the campaign neighborhood.",
      inputSchema: {
        type: "object",
        properties: { name: { type: "string", minLength: 1, maxLength: 32 } },
        required: ["name"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(input) {
        if (!setPlayerName(input?.name)) throw new Error("A player name is required.");
        return { name: store.playerName, status: "ready" };
      }
    });

    register({
      name: "start_campaign",
      title: "Start campaign",
      description: "Start one of the visible CyberChoices campaigns and open its first level.",
      inputSchema: {
        type: "object",
        properties: { campaign: { type: "string", enum: campaigns.map((item) => item.id) } },
        required: ["campaign"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || !campaigns.some((item) => item.id === input.campaign)) throw new Error("Unknown campaign.");
        if (!startCampaign(input.campaign)) throw new Error("Campaign was not started.");
        return { campaign: input.campaign, level: 1, status: "started" };
      }
    });

    register({
      name: "inspect_campaign_evidence",
      title: "Inspect evidence",
      description: "Analyze evidence item 1, 2, or 3 in the currently visible CyberChoices incident.",
      inputSchema: {
        type: "object",
        properties: { evidence: { type: "integer", minimum: 1, maximum: 3 } },
        required: ["evidence"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!Number.isInteger(input?.evidence) || input.evidence < 1 || input.evidence > 3) throw new Error("Evidence must be 1, 2, or 3.");
        if (!scanEvidence(input.evidence - 1)) throw new Error("No evidence is available to inspect.");
        return { evidence: input.evidence, analyzed: store.active.scannedEvidence.length, total: 3 };
      }
    });

    register({
      name: "choose_campaign_response",
      title: "Choose response",
      description: "Submit option 1, 2, or 3 for the currently visible CyberChoices incident.",
      inputSchema: {
        type: "object",
        properties: { option: { type: "integer", minimum: 1, maximum: 3 } },
        required: ["option"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!Number.isInteger(input?.option) || input.option < 1 || input.option > 3) throw new Error("Option must be 1, 2, or 3.");
        const campaign = currentCampaign();
        const level = campaign && store.active ? campaign.levels[store.active.levelIndex] : null;
        const displayedChoice = campaign && level ? orderedChoices(campaign, level)[input.option - 1] : null;
        if (!displayedChoice || !chooseResponse(displayedChoice.sourceIndex)) throw new Error("No unanswered incident is active.");
        return { option: input.option, score: store.active.score, phase: store.active.phase };
      }
    });
  }

  registerWebMCP();
  render();
})();
