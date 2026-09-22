// menus.js
// ============================================================================
// Actions and UI rendering for menus.
// Depends on: utils, state, actions, hud
// ============================================================================

// Top-level menu containers
const menuContainerNode = $('.menus');
const menuMainNode = $('.menu--main');
const menuPauseNode = $('.menu--pause');
const menuScoreNode = $('.menu--score');
const menuHowItWorksNode = $('.menu--how-it-works');

const finalScoreLblNode = $('.final-score-lbl');
const highScoreLblNode = $('.high-score-lbl');



function showMenu(node) {
	node.classList.add('active');
}

function hideMenu(node) {
	node.classList.remove('active');
}

function renderMenus() {
	hideMenu(menuMainNode);
	hideMenu(menuPauseNode);
	hideMenu(menuScoreNode);
	hideMenu(menuHowItWorksNode);

	switch (state.menus.active) {
		case MENU_MAIN:
			showMenu(menuMainNode);
			break;
		case MENU_PAUSE:
			showMenu(menuPauseNode);
			break;
		case MENU_SCORE:
			finalScoreLblNode.textContent = formatNumber(state.game.score);
			if (isNewHighScore()) {
				highScoreLblNode.textContent = 'New High Score!';
			} else {
				highScoreLblNode.textContent = `High Score: ${formatNumber(getHighScore())}`;
			}
			showMenu(menuScoreNode);
			break;
		case MENU_HOW_IT_WORKS:
			showMenu(menuHowItWorksNode);
			break;
	}

	setHudVisibility(!isMenuVisible());
	menuContainerNode.classList.toggle('has-active', isMenuVisible());
	menuContainerNode.classList.toggle('interactive-mode', isMenuVisible() && pointerIsDown);
}

renderMenus();


////////////////////
// Button Actions //
////////////////////

// Main Menu
handleClick($('.play-normal-btn'), () => {
	if (typeof playSound !== 'undefined') playSound('start');
	setGameMode(GAME_MODE_RANKED);
	setActiveMenu(null);
	resetGame();
});

handleClick($('.play-casual-btn'), () => {
	if (typeof playSound !== 'undefined') playSound('start');
	setGameMode(GAME_MODE_CASUAL);
	setActiveMenu(null);
	resetGame();
});

handleClick($('.how-it-works-btn'), () => setActiveMenu(MENU_HOW_IT_WORKS));

// How It Works Menu
handleClick($('.play-normal-btn-from-how'), () => {
	if (typeof playSound !== 'undefined') playSound('start');
	setGameMode(GAME_MODE_RANKED);
	setActiveMenu(null);
	resetGame();
});
handleClick($('.menu-btn--how-it-works'), () => setActiveMenu(MENU_MAIN));

// Pause Menu
handleClick($('.resume-btn'), () => resumeGame());
handleClick($('.menu-btn--pause'), () => setActiveMenu(MENU_MAIN));

// Score Menu
handleClick($('.play-again-btn'), () => {
	if (typeof playSound !== 'undefined') playSound('start');
	setActiveMenu(null);
	resetGame();
});

handleClick($('.menu-btn--score'), () => setActiveMenu(MENU_MAIN));
