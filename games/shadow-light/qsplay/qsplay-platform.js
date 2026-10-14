// QS Play portal adapter for Sunlight Beam.
// Only the portal build includes this file (see build.sh). It loads after the
// QS Play SDK and before the game, and replaces the methods of the game's
// `platform` object with SDK calls. The game itself has no portal code.
(function () {
    const sdk = window.QSPlaySDK;
    if (!sdk) return; // SDK failed to load: the game falls back to plain browser APIs

    // SDK calls go out one after another, in the order the game made them
    // (loadingStart -> loadingStop -> gameplayStart/Stop ...), and a failed
    // call never breaks the game.
    let queue = Promise.resolve();
    function call(fn) {
        queue = queue.then(fn).catch(err => console.warn('[QS Play]', err && err.code, err));
        return queue;
    }

    // As early as possible, right after the SDK is available
    call(() => sdk.game.loadingStart());

    // Saved settings live in the portal's data storage (for guests and
    // signed-in players alike). They are read once at start-up; reads in the
    // game are synchronous, so they come from this copy.
    const SETTING_KEYS = ['shadowLight.music', 'shadowLight.sfx'];
    const settings = {};

    let fullscreen = false;
    const fullscreenCallbacks = [];
    function setFullscreen(value) {
        if (fullscreen === value) return;
        fullscreen = value;
        fullscreenCallbacks.forEach(cb => cb());
    }
    sdk.game.addFullscreenListener(({ isFullscreen }) => setFullscreen(!!isFullscreen));

    let lastContext = '';

    window.portalPlatform = {
        init() {
            return Promise.all(SETTING_KEYS.map(key =>
                sdk.data.getItem(key)
                    .then(value => { if (typeof value === 'boolean') settings[key] = value; })
                    .catch(() => {})
            ));
        },

        loadingDone() {
            call(() => sdk.game.loadingStop());
        },

        onGameplayChange(active) {
            call(() => active ? sdk.game.gameplayStart() : sdk.game.gameplayStop());
        },

        setContext(context) {
            const json = JSON.stringify(context);
            if (json === lastContext) return;
            lastContext = json;
            call(() => sdk.game.setGameContext(context));
        },

        loadSetting(key, fallback) {
            return key in settings ? settings[key] : fallback;
        },
        saveSetting(key, value) {
            if (settings[key] === value) return;
            settings[key] = value;
            sdk.data.setItem(key, value).catch(err => console.warn('[QS Play]', err && err.code, err));
        },

        // Fullscreen only through the portal (the browser API is not allowed)
        fullscreenSupported: true,
        isFullscreen() {
            return fullscreen;
        },
        toggleFullscreen() {
            // Sent right away, not queued: browsers allow fullscreen only
            // while the click or key press that asked for it is being handled
            const wanted = !fullscreen;
            (wanted ? sdk.game.requestFullscreen() : sdk.game.exitFullscreen())
                .then(() => setFullscreen(wanted))
                .catch(err => console.warn('[QS Play]', err && err.code, err));
        },
        onFullscreenChange(callback) {
            fullscreenCallbacks.push(callback);
        }
    };
})();
