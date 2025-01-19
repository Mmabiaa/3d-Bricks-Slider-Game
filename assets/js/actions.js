// actions.js
// ============================================================================
// ============================================================================

//////////////////
// MENU ACTIONS //
//////////////////

function setActiveMenu(menu) {
	state.menus.active = menu;
	renderMenus();
}


/////////////////
// HUD ACTIONS //
/////////////////

function setScore(score) {
	state.game.score = score;
	renderScoreHud();
}

function incrementScore(inc) {
	if (isInGame()) {
		state.game.score += inc;
		if (state.game.score < 0) {
			state.game.score = 0;
		}
		renderScoreHud();
	}
}

function setCubeCount(count) {
	state.game.cubeCount = count;
	renderScoreHud();
}

function incrementCubeCount(inc) {
	if (isInGame()) {
		state.game.cubeCount += inc;
		renderScoreHud();
	}
}


function setGameMode(mode) {
	state.game.mode = mode;
}

function resetGame() {
	resetAllTargets();
	state.game.time = 0;
	resetAllCooldowns();
	setScore(0);
	setCubeCount(0);
	spawnTime = getSpawnDelay();
}

function pauseGame() {
	isInGame() && setActiveMenu(MENU_PAUSE);
}

function resumeGame() {
	isPaused() && setActiveMenu(null);
}

function endGame() {
	handleCanvasPointerUp();
	if (isNewHighScore()) {
		setHighScore(state.game.score);
	}
	setActiveMenu(MENU_SCORE);
}



window.addEventListener('keydown', event => {
	if (event.key === 'p') {
		isPaused() ? resumeGame() : pauseGame();
	}
});


let spawnTime = 0;
const maxSpawnX = 450;
const pointerDelta = { x: 0, y: 0 };
const pointerDeltaScaled = { x: 0, y: 0 };

// Temp slowmo state. Should be relocated once this stabilizes.
const slowmoDuration = 1500;
let slowmoRemaining = 0;
let spawnExtra = 0;
const spawnExtraDelay = 300;
let targetSpeed = 1;


function tick(width, height, simTime, simSpeed, lag) {
	PERF_START('frame');
	PERF_START('tick');

	state.game.time += simTime;

	if (slowmoRemaining > 0) {
		slowmoRemaining -= simTime;
		if (slowmoRemaining < 0) {
			slowmoRemaining = 0;
		}
		targetSpeed = pointerIsDown ? 0.075 : 0.3;
	} else {
		const menuPointerDown = isMenuVisible() && pointerIsDown;
		targetSpeed = menuPointerDown ? 0.025 : 1;
	}

	renderSlowmoStatus(slowmoRemaining / slowmoDuration);

	gameSpeed += (targetSpeed - gameSpeed) / 22 * lag;
	gameSpeed = clamp(gameSpeed, 0, 1);

	const centerX = width / 2;
	const centerY = height / 2;

	const simAirDrag = 1 - (airDrag * simSpeed);
	const simAirDragSpark = 1 - (airDragSpark * simSpeed);

	// Pointer Tracking
	// -------------------

	// Compute speed and x/y deltas.
	// There is also a "scaled" variant taking game speed into account. This serves two purposes:
	//  - Lag won't create large spikes in speed/deltas
	//  - In slow mo, speed is increased proportionately to match "reality". Without this boost,
	//    it feels like your actions are dampened in slow mo.
	const forceMultiplier = 1 / (simSpeed * 0.75 + 0.25);
	pointerDelta.x = 0;
	pointerDelta.y = 0;
	pointerDeltaScaled.x = 0;
	pointerDeltaScaled.y = 0;
	const lastPointer = touchPoints[touchPoints.length - 1];

	if (pointerIsDown && lastPointer && !lastPointer.touchBreak) {
		pointerDelta.x = (pointerScene.x - lastPointer.x);
		pointerDelta.y = (pointerScene.y - lastPointer.y);
		pointerDeltaScaled.x = pointerDelta.x * forceMultiplier;
		pointerDeltaScaled.y = pointerDelta.y * forceMultiplier;
	}
	const pointerSpeed = Math.hypot(pointerDelta.x, pointerDelta.y);
	const pointerSpeedScaled = pointerSpeed * forceMultiplier;

	// Track points for later calculations, including drawing trail.
	touchPoints.forEach(p => p.life -= simTime);

	if (pointerIsDown) {
		touchPoints.push({
			x: pointerScene.x,
			y: pointerScene.y,
			life: touchPointLife
		});
	}

	while (touchPoints[0] && touchPoints[0].life <= 0) {
		touchPoints.shift();
	}


	// Entity Manipulation
	// --------------------
	PERF_START('entities');

	// Spawn targets
	spawnTime -= simTime;
	if (spawnTime <= 0) {
		if (spawnExtra > 0) {
			spawnExtra--;
			spawnTime = spawnExtraDelay;
		} else {
			spawnTime = getSpawnDelay();
		}
		const target = getTarget();
		const spawnRadius = Math.min(centerX * 0.8, maxSpawnX);
		target.x = (Math.random() * spawnRadius * 2 - spawnRadius);
		target.y = centerY + targetHitRadius * 2;
		target.z = (Math.random() * targetRadius*2 - targetRadius);
		target.xD = Math.random() * (target.x * -2 / 120);
		target.yD = -20;
		targets.push(target);
	}

	// Animate targets and remove when offscreen
	const leftBound = -centerX + targetRadius;
	const rightBound = centerX - targetRadius;
	const ceiling = -centerY - 120;
	const boundDamping = 0.4;

	targetLoop:
	for (let i = targets.length - 1; i >= 0; i--) {
		const target = targets[i];
		target.x += target.xD * simSpeed;
		target.y += target.yD * simSpeed;

		if (target.y < ceiling) {
			target.y = ceiling;
			target.yD = 0;
		}

		if (target.x < leftBound) {
			target.x = leftBound;
			target.xD *= -boundDamping;
		} else if (target.x > rightBound) {
			target.x = rightBound;
			target.xD *= -boundDamping;
		}

		if (target.z < backboardZ) {
			target.z = backboardZ;
			target.zD *= -boundDamping;
		}

		target.yD += gravity * simSpeed;
		target.rotateX += target.rotateXD * simSpeed;
		target.rotateY += target.rotateYD * simSpeed;
		target.rotateZ += target.rotateZD * simSpeed;
		target.transform();
		target.project();

		// Remove if offscreen
		if (target.y > centerY + targetHitRadius * 2) {
			targets.splice(i, 1);
			returnTarget(target);
			if (isInGame()) {
				if (isCasualGame()) {
					incrementScore(-25);
				} else {
					endGame();
				}
			}
			continue;
		}


		// If pointer is moving really fast, we want to hittest multiple points along the path.
		// We can't use scaled pointer speed to determine this, since we care about actual screen
		const hitTestCount = Math.ceil(pointerSpeed / targetRadius * 2);
		// Start loop at `1` and use `<=` check, so we skip 0% and end up at 100%.
		// This omits the previous point position, and includes the most recent.
		for (let ii=1; ii<=hitTestCount; ii++) {
			const percent = 1 - (ii / hitTestCount);
			const hitX = pointerScene.x - pointerDelta.x * percent;
			const hitY = pointerScene.y - pointerDelta.y * percent;
			const distance = Math.hypot(
				hitX - target.projected.x,
				hitY - target.projected.y
			);

			if (distance <= targetHitRadius) {
				// Hit! (though we don't want to allow hits on multiple sequential frames)
				if (!target.hit) {
					target.hit = true;

					target.xD += pointerDeltaScaled.x * hitDampening;
					target.yD += pointerDeltaScaled.y * hitDampening;
					target.rotateXD += pointerDeltaScaled.y * 0.001;
					target.rotateYD += pointerDeltaScaled.x * 0.001;

					const sparkSpeed = 7 + pointerSpeedScaled * 0.125;

					if (pointerSpeedScaled > minPointerSpeed) {
						target.health--;
						incrementScore(10);

						if (target.health <= 0) {
							incrementCubeCount(1);
							createBurst(target, forceMultiplier);
							sparkBurst(hitX, hitY, 8, sparkSpeed);
							if (target.wireframe) {
								slowmoRemaining = slowmoDuration;
								spawnTime = 0;
								spawnExtra = 2;
							}
							targets.splice(i, 1);
							returnTarget(target);
						} else {
							sparkBurst(hitX, hitY, 8, sparkSpeed);
							glueShedSparks(target);
							updateTargetHealth(target, 0);
						}
					} else {
						incrementScore(5);
						sparkBurst(hitX, hitY, 3, sparkSpeed);
					}
				}
				// Break the current loop and continue the outer loop.
				// This skips to processing the next target.
				continue targetLoop;
			}
		}

		// This code will only run if target hasn't been "hit".
		target.hit = false;
	}

	// Animate fragments and remove when offscreen.
	const fragBackboardZ = backboardZ + fragRadius;
	// Allow fragments to move off-screen to sides for a while, since shadows are still visible.
	const fragLeftBound = -width;
	const fragRightBound = width;

	for (let i = frags.length - 1; i >= 0; i--) {
		const frag = frags[i];
		frag.x += frag.xD * simSpeed;
		frag.y += frag.yD * simSpeed;
		frag.z += frag.zD * simSpeed;

		frag.xD *= simAirDrag;
		frag.yD *= simAirDrag;
		frag.zD *= simAirDrag;

		if (frag.y < ceiling) {
			frag.y = ceiling;
			frag.yD = 0;
		}

		if (frag.z < fragBackboardZ) {
			frag.z = fragBackboardZ;
			frag.zD *= -boundDamping;
		}

		frag.yD += gravity * simSpeed;
		frag.rotateX += frag.rotateXD * simSpeed;
		frag.rotateY += frag.rotateYD * simSpeed;
		frag.rotateZ += frag.rotateZD * simSpeed;
		frag.transform();
		frag.project();

		// Removal conditions
		if (
			// Bottom of screen
			frag.projected.y > centerY + targetHitRadius ||
			// Sides of screen
			frag.projected.x < fragLeftBound ||
			frag.projected.x > fragRightBound ||
			// Too close to camera
			frag.z > cameraFadeEndZ
		) {
			frags.splice(i, 1);
			returnFrag(frag);
			continue;
		}
	}

	// 2D sparks
	for (let i = sparks.length - 1; i >= 0; i--) {
		const spark = sparks[i];
		spark.life -= simTime;
		if (spark.life <= 0) {
			sparks.splice(i, 1);
			returnSpark(spark);
			continue;
		}
		spark.x += spark.xD * simSpeed;
		spark.y += spark.yD * simSpeed;
		spark.xD *= simAirDragSpark;
		spark.yD *= simAirDragSpark;
		spark.yD += gravity * simSpeed;
	}

	PERF_END('entities');

	// 3D transforms
	// -------------------

	PERF_START('3D');

	// Aggregate all scene vertices/polys
	allVertices.length = 0;
	allPolys.length = 0;
	allShadowVertices.length = 0;
	allShadowPolys.length = 0;
	targets.forEach(entity => {
		allVertices.push(...entity.vertices);
		allPolys.push(...entity.polys);
		allShadowVertices.push(...entity.shadowVertices);
		allShadowPolys.push(...entity.shadowPolys);
	});

	frags.forEach(entity => {
		allVertices.push(...entity.vertices);
		allPolys.push(...entity.polys);
		allShadowVertices.push(...entity.shadowVertices);
		allShadowPolys.push(...entity.shadowPolys);
	});

	// Scene calculations/transformations
	allPolys.forEach(p => computePolyNormal(p, 'normalWorld'));
	allPolys.forEach(computePolyDepth);
	allPolys.sort((a, b) => b.depth - a.depth);

	// Perspective projection
	allVertices.forEach(projectVertex);

	allPolys.forEach(p => computePolyNormal(p, 'normalCamera'));

	PERF_END('3D');

	PERF_START('shadows');

	// Rotate shadow vertices to light source perspective
	transformVertices(
		allShadowVertices,
		allShadowVertices,
		0, 0, 0,
		TAU/8, 0, 0,
		1, 1, 1
	);

	allShadowPolys.forEach(p => computePolyNormal(p, 'normalWorld'));

	const shadowDistanceMult = Math.hypot(1, 1);
	const shadowVerticesLength = allShadowVertices.length;
	for (let i=0; i<shadowVerticesLength; i++) {
		const distance = allVertices[i].z - backboardZ;
		allShadowVertices[i].z -= shadowDistanceMult * distance;
	}
	transformVertices(
		allShadowVertices,
		allShadowVertices,
		0, 0, 0,
		-TAU/8, 0, 0,
		1, 1, 1
	);
	allShadowVertices.forEach(projectVertex);

	PERF_END('shadows');

	PERF_END('tick');
}

function draw(ctx, width, height, viewScale) {
	PERF_START('draw');

	const halfW = width / 2;
	const halfH = height / 2;


	// 3D Polys

	ctx.lineJoin = 'bevel';

	PERF_START('drawShadows');
	ctx.fillStyle = shadowColor;
	ctx.strokeStyle = shadowColor;
	allShadowPolys.forEach(p => {
		if (p.wireframe) {
			ctx.lineWidth = 2;
			ctx.beginPath();
			const { vertices } = p;
			const vCount = vertices.length;
			const firstV = vertices[0];
			ctx.moveTo(firstV.x, firstV.y);
			for (let i=1; i<vCount; i++) {
				const v = vertices[i];
				ctx.lineTo(v.x, v.y);
			}
			ctx.closePath();
			ctx.stroke();
		} else {
			ctx.beginPath();
			const { vertices } = p;
			const vCount = vertices.length;
			const firstV = vertices[0];
			ctx.moveTo(firstV.x, firstV.y);
			for (let i=1; i<vCount; i++) {
				const v = vertices[i];
				ctx.lineTo(v.x, v.y);
			}
			ctx.closePath();
			ctx.fill();
		}
	});
	PERF_END('drawShadows');

	PERF_START('drawPolys');

	allPolys.forEach(p => {
		if (!p.wireframe && p.normalCamera.z < 0) return;

		if (p.strokeWidth !== 0) {
			ctx.lineWidth = p.normalCamera.z < 0 ? p.strokeWidth * 0.5 : p.strokeWidth;
			ctx.strokeStyle = p.normalCamera.z < 0 ? p.strokeColorDark : p.strokeColor;
		}

		const { vertices } = p;
		const lastV = vertices[vertices.length - 1];
		const fadeOut = p.middle.z > cameraFadeStartZ;

		if (!p.wireframe) {
			const normalLight = p.normalWorld.y * 0.5 + p.normalWorld.z * -0.5;
			const lightness = normalLight > 0
				? 0.1
				: ((normalLight ** 32 - normalLight) / 2) * 0.9 + 0.1;
			ctx.fillStyle = shadeColor(p.color, lightness);
		}

		// Fade out polys close to camera. `globalAlpha` must be reset later.
		if (fadeOut) {

			ctx.globalAlpha = Math.max(0, 1 - (p.middle.z - cameraFadeStartZ) / cameraFadeRange);
		}

		ctx.beginPath();
		ctx.moveTo(lastV.x, lastV.y);
		for (let v of vertices) {
			ctx.lineTo(v.x, v.y);
		}

		if (!p.wireframe) {
			ctx.fill();
		}
		if (p.strokeWidth !== 0) {
			ctx.stroke();
		}

		if (fadeOut) {
			ctx.globalAlpha = 1;
		}
	});
	PERF_END('drawPolys');


	PERF_START('draw2D');

	// 2D Sparks
	ctx.strokeStyle = sparkColor;
	ctx.lineWidth = sparkThickness;
	ctx.beginPath();
	sparks.forEach(spark => {
		ctx.moveTo(spark.x, spark.y);
		const scale = (spark.life / spark.maxLife) ** 0.5 * 1.5;
		ctx.lineTo(spark.x - spark.xD*scale, spark.y - spark.yD*scale);

	});
	ctx.stroke();


	// Touch Strokes
	// ---------------

	ctx.strokeStyle = touchTrailColor;
	const touchPointCount = touchPoints.length;
	for (let i=1; i<touchPointCount; i++) {
		const current = touchPoints[i];
		const prev = touchPoints[i-1];
		if (current.touchBreak || prev.touchBreak) {
			continue;
		}
		const scale = current.life / touchPointLife;
		ctx.lineWidth = scale * touchTrailThickness;
		ctx.beginPath();
		ctx.moveTo(prev.x, prev.y);
		ctx.lineTo(current.x, current.y);
		ctx.stroke();
	}

	PERF_END('draw2D');

	PERF_END('draw');
	PERF_END('frame');

	// Display performance updates.
	PERF_UPDATE();
}


function setupCanvases() {
	const ctx = canvas.getContext('2d');
	// devicePixelRatio alias
	const dpr = window.devicePixelRatio || 1;
	// View will be scaled so objects appear sized similarly on all screen sizes.
	let viewScale;
	// Dimensions (taking viewScale into account!)
	let width, height;

	function handleResize() {
		const w = window.innerWidth;
		const h = window.innerHeight;
		viewScale = h / 1000;
		width = w / viewScale;
		height = h / viewScale;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
	}

	// Set initial size
	handleResize();
	// resize fullscreen canvas
	window.addEventListener('resize', handleResize);


	// Run game loop
	let lastTimestamp = 0;
	function frameHandler(timestamp) {
		let frameTime = timestamp - lastTimestamp;
		lastTimestamp = timestamp;

		// always queue another frame
		raf();

		// If game is paused, we'll still track frameTime (above) but all other
		// game logic and drawing can be avoided.
		if (isPaused()) return;

		// make sure negative time isn't reported (first frame can be whacky)
		if (frameTime < 0) {
			frameTime = 17;
		}
		// - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
		else if (frameTime > 68) {
			frameTime = 68;
		}

		const halfW = width / 2;
		const halfH = height / 2;


		pointerScene.x = pointerScreen.x / viewScale - halfW;
		pointerScene.y = pointerScreen.y / viewScale - halfH;

		const lag = frameTime / 16.6667;
		const simTime = gameSpeed * frameTime;
		const simSpeed = gameSpeed * lag;
		tick(width, height, simTime, simSpeed, lag);

		// Auto clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const drawScale = dpr * viewScale;
		ctx.scale(drawScale, drawScale);
		ctx.translate(halfW, halfH);
		draw(ctx, width, height, viewScale);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	const raf = () => requestAnimationFrame(frameHandler);

	raf();
}

function handleCanvasPointerDown(x, y) {
	if (!pointerIsDown) {
		pointerIsDown = true;
		pointerScreen.x = x;
		pointerScreen.y = y;
		// On when menus are open, point down/up toggles an interactive mode.
		// We just need to rerender the menu system for it to respond.
		if (isMenuVisible()) renderMenus();
	}
}

function handleCanvasPointerUp() {
	if (pointerIsDown) {
		pointerIsDown = false;
		touchPoints.push({
			touchBreak: true,
			life: touchPointLife
		});
		// On when menus are open, point down/up toggles an interactive mode.
		// We just need to rerender the menu system for it to respond.
		if (isMenuVisible()) renderMenus();
	}
}

function handleCanvasPointerMove(x, y) {
	if (pointerIsDown) {
		pointerScreen.x = x;
		pointerScreen.y = y;
	}
}


// Use pointer events if available, otherwise fallback to touch events (for iOS).
if ('PointerEvent' in window) {
	canvas.addEventListener('pointerdown', event => {
		event.isPrimary && handleCanvasPointerDown(event.clientX, event.clientY);
	});

	canvas.addEventListener('pointerup', event => {
		event.isPrimary && handleCanvasPointerUp();
	});

	canvas.addEventListener('pointermove', event => {
		event.isPrimary && handleCanvasPointerMove(event.clientX, event.clientY);
	});

	// We also need to know if the mouse leaves the page. For this game, it's best if that
	// cancels a swipe, so essentially acts as a "mouseup" event.
	document.body.addEventListener('mouseleave', handleCanvasPointerUp);
} else {
	let activeTouchId = null;
	canvas.addEventListener('touchstart', event => {
		if (!pointerIsDown) {
			const touch = event.changedTouches[0];
			activeTouchId = touch.identifier;
			handleCanvasPointerDown(touch.clientX, touch.clientY);
		}
	});
	canvas.addEventListener('touchend', event => {
		for (let touch of event.changedTouches) {
			if (touch.identifier === activeTouchId) {
				handleCanvasPointerUp();
				break;
			}
		}
	});
	canvas.addEventListener('touchmove', event => {
		for (let touch of event.changedTouches) {
			if (touch.identifier === activeTouchId) {
				handleCanvasPointerMove(touch.clientX, touch.clientY);
				event.preventDefault();
				break;
			}
		}
	}, { passive: false });
}

setupCanvases();