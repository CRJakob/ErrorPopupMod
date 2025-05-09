var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ErrorPopupMod_instances, _ErrorPopupMod_showError;
import { PolyMod } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";
// If the below line is uncommented in main branch, then scream at me
// import { PolyMod, PolyModLoader } from "../PolyModLoader/PolyModLoader.js";
class ErrorPopupMod extends PolyMod {
    constructor() {
        super(...arguments);
        _ErrorPopupMod_instances.add(this);
        this.init = (pmlInstance) => {
            this.pml = pmlInstance;
            window.addEventListener("error", e => {
                const { error } = e;
                __classPrivateFieldGet(this, _ErrorPopupMod_instances, "m", _ErrorPopupMod_showError).call(this, error);
            });
            window.addEventListener("unhandledrejection", e => {
                const { reason } = e;
                __classPrivateFieldGet(this, _ErrorPopupMod_instances, "m", _ErrorPopupMod_showError).call(this, reason);
            });
        };
    }
}
_ErrorPopupMod_instances = new WeakSet(), _ErrorPopupMod_showError = function _ErrorPopupMod_showError(err) {
    // ~~stolen~~ i mean borrowed from pmlcore with a few changes
    const menuDiv = document.getElementById("ui");
    const trackInfoDiv = document.createElement('div');
    trackInfoDiv.style = `    interpolate-size: allow-keywords;
        --text-disabled-color: #5d6a7c;
        --surface-color: #28346a;
        --surface-secondary-color: #212b58;
        --surface-tertiary-color: #192042;
        --surface-transparent-color: rgba(40, 52, 106, 0.5);
        --button-color: #112052;
        --button-hover-color: #334b77;
        --button-active-color: #151f41;
        --button-disabled-color: #313d53;
        scrollbar-color: #7272c2 #223;
        pointer-events: none;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        text-align: center;
        font-style: italic;
        font-family: ForcedSquare, Arial, sans-serif;
        line-height: 1;
        position: absolute;
        left: calc(50% - 1050px / 2);
        top: 0;
        z-index: 2;
        display: flex;
        margin: 0;
        padding: 0;
        width: 1000px;
        height: 100%;`;
    const containerDiv = document.createElement("div");
    containerDiv.style = `    interpolate-size: allow-keywords;
        --text-disabled-color: #5d6a7c;
        --surface-color: #28346a;
        --surface-secondary-color: #212b58;
        --surface-tertiary-color: #192042;
        --surface-transparent-color: rgba(40, 52, 106, 0.5);
        --button-color: #112052;
        --button-hover-color: #334b77;
        --button-active-color: #151f41;
        --button-disabled-color: #313d53;
        scrollbar-color: #7272c2 #223;
        -webkit-tap-highlight-color: transparent;
        color: #ffffff;
        padding-left: 10px;
        user-select: none;
        text-align: left;
        font-style: italic;
        font-family: ForcedSquare, Arial, sans-serif;
        line-height: 1;
        flex-grow: 1;
        background-color: var(--surface-secondary-color);
        overflow-x: hidden;
        overflow-y: scroll;
        pointer-events: auto;`;
    const msg = err instanceof Error ? err.stack : `(Custom error message): ${err}`;
    containerDiv.innerHTML =
        `
            <h1>Oh no, PolyTrack has crashed!</h1>
            <p>Here is the error message so that you can report it:</p>
            <pre><code>${msg}</code></pre>
            `;
    trackInfoDiv.appendChild(containerDiv);
    menuDiv?.appendChild(trackInfoDiv);
};
export const polyMod = new ErrorPopupMod();
