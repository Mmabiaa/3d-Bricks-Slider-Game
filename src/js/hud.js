// hud.js
// ============================================================================
// HUD component visibility and updates.
// Depends on: utils, state, actions
// ============================================================================

const hudContainerNode = $('.hud');

function setHudVisibility(visible) {
	if (visible) {
		hudContainerNode.style.display = 'block';
	} else {
		hudContainerNode.style.display = 'none';
	}
}


///////////
// Score //
///////////
const scoreNode = $('.score-lbl');
const cubeCountNode = $('.cube-count-lbl');
const levelNode = $('.level-lbl');
const livesNode = $('.lives-lbl');

function renderLivesHud() {
	const lives = state.game.lives;
	livesNode.innerText = '❤️'.repeat(Math.max(0, lives));
}

function renderLevelHud() {
	const level = state.game.lastMilestone + 1;
	levelNode.innerText = `LVL ${level}`;
}

function renderScoreHud() {
	if (isCasualGame()) {
		scoreNode.style.display = 'none';
		cubeCountNode.style.opacity = 1;
	} else {
		scoreNode.innerText = `SCORE: ${state.game.score}`;
		scoreNode.style.display = 'block';
		cubeCountNode.style.opacity = 0.65;
	}
	cubeCountNode.innerText = `CUBES SMASHED: ${state.game.cubeCount}`;
	renderLevelHud();
	renderLivesHud();
}

renderScoreHud();


//////////////////
// Pause Button //
//////////////////

handlePointerDown($('.pause-btn'), () => pauseGame());


////////////////////
// Slow-Mo Status //
////////////////////

const slowmoNode = $('.slowmo');
const slowmoBarNode = $('.slowmo__bar');

function renderSlowmoStatus(percentRemaining) {
	slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;
	slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}

//////////////////////////
// Milestone Notifications
//////////////////////////

const notifNode = document.createElement('div');
notifNode.className = 'milestone-notify';
document.body.appendChild(notifNode);

let notifTimeout;
function showMilestoneNotification(text) {
	notifNode.innerText = text;
	notifNode.classList.add('show');
	clearTimeout(notifTimeout);
	notifTimeout = setTimeout(() => {
		notifNode.classList.remove('show');
	}, 3000);
}