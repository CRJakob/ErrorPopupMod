var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PolyDebug_instances, _PolyDebug_showCrashScreen, _PolyDebug_showModDebugScreen;
import { PolyMod, MixinType } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";
// If the below line is uncommented in main branch, then scream at me
// import { PolyMod, PolyModLoader, MixinType } from "../PolyModLoader/PolyModLoader.js";
class PolyDebug extends PolyMod {
    constructor() {
        super(...arguments);
        _PolyDebug_instances.add(this);
        this.init = (pmlInstance) => {
            this.pml = pmlInstance;
            window.addEventListener("error", e => {
                const { error } = e;
                __classPrivateFieldGet(this, _PolyDebug_instances, "m", _PolyDebug_showCrashScreen).call(this, error);
            });
            window.addEventListener("unhandledrejection", e => {
                const { reason } = e;
                __classPrivateFieldGet(this, _PolyDebug_instances, "m", _PolyDebug_showCrashScreen).call(this, reason);
            });
            this.pml.registerFuncMixin("hD", MixinType.HEAD, [], () => {
                throw TypeError("die");
            });
        };
    }
}
_PolyDebug_instances = new WeakSet(), _PolyDebug_showCrashScreen = function _PolyDebug_showCrashScreen(err) {
    // some hacky init stuff copied from pmlcore
    const menuDiv = document.getElementById("ui");
    let mainDiv = document.getElementById("crash-screen");
    let mainDivCreated = false;
    if (mainDiv === null) {
        mainDiv = document.createElement("div");
        mainDiv.id = "crash-screen";
        mainDivCreated = true;
    }
    mainDiv.className = "track-info";
    mainDiv.innerHTML = "";
    const containerDiv = document.createElement("div");
    containerDiv.className = "leaderboard";
    containerDiv.style.width = "100%";
    const textDiv = document.createElement("div");
    textDiv.className = "container";
    textDiv.style =
        `
            color: #ffffff;
            padding-left: 10px;
            overflow-wrap: break-word;
            `;
    // button is in a wrapper div so it doesnt take up the full bottom space
    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "button-wrapper";
    const button = document.createElement("button");
    button.className = "button first";
    button.disabled = false;
    button.style = "margin: 10px 0; float: bottom;padding: 10px; margin-left:2px; align";
    button.innerHTML = "Test";
    button.addEventListener("click", _ => {
        textDiv.remove();
        containerDiv.innerHTML = "";
        __classPrivateFieldGet(this, _PolyDebug_instances, "m", _PolyDebug_showModDebugScreen).call(this, containerDiv);
    });
    buttonWrapper.appendChild(button);
    const msg = err instanceof Error ? err.stack : `(Custom error message): ${err}`;
    textDiv.innerHTML =
        `
            <h1>Oh no, PolyTrack has crashed!</h1>
            <p>Here is the error message so that you can report it:</p>
            <pre style="white-space: pre-wrap"e><code>${msg}</code></pre>
            `;
    containerDiv.appendChild(textDiv);
    containerDiv.appendChild(buttonWrapper);
    mainDiv.appendChild(containerDiv);
    if (mainDivCreated)
        menuDiv.appendChild(mainDiv);
}, _PolyDebug_showModDebugScreen = function _PolyDebug_showModDebugScreen(div) {
    const mods = JSON.parse(window.localStorage.getItem("polyMods"));
    for (const [id, mod] of mods.entries()) {
        const modDiv = document.createElement('div');
        modDiv.style.display = "flex";
        modDiv.style.flexDirection = "column";
        const dropdownDiv = document.createElement("div");
        dropdownDiv.style.display = "flex";
        dropdownDiv.style.height = "30px";
        const dropdownButton = document.createElement("button");
        dropdownButton.className = "button first";
        dropdownButton.style.display = "inline-flex";
        dropdownButton.style.flex = "4";
        dropdownButton.style.fontSize = "15px";
        dropdownButton.innerHTML = `<img src="images/arrow_right.svg">&nbsp;${id}`;
        dropdownButton.dataset.dropped = "false";
        dropdownButton.addEventListener("click", _ => {
            if (dropdownButton.dataset.dropped === "true") {
                document.getElementById(`debugscreen-dropdown${id}`)?.remove();
                dropdownButton.innerHTML = `<img src="images/arrow_right.svg">&nbsp;${id}`;
                dropdownButton.dataset.dropped = "false";
                return;
            }
            dropdownButton.innerHTML = `<img src="images/arrow_down.svg">&nbsp;${id}`;
            dropdownButton.dataset.dropped = "true";
            const dropDownDiv = document.createElement("div");
            dropDownDiv.id = `debugscreen-dropdown${id}`;
            const baseDiv = document.createElement("div");
            baseDiv.style.display = "flex";
            baseDiv.style.gap = "10px";
            baseDiv.className = "nickname";
            baseDiv.style.position = "static";
            baseDiv.style.width = "100%";
            const base = document.createElement("div");
            base.style =
                `
                    align-content: center;
                    color: #ffffff;
                    `;
            base.innerText = "base:";
            const baseText = document.createElement("input");
            baseText.type = "text";
            baseText.style.height = "20px";
            baseText.style.fontSize = "15px";
            baseText.placeholder = mod.base;
            baseText.value = mod.base;
            baseText.addEventListener("input", _ => {
                const text = baseText.value === "" ? baseText.placeholder : baseText.value;
                mod.base = text;
                localStorage.setItem("polyMods", JSON.stringify(mods));
            });
            baseDiv.appendChild(base);
            baseDiv.appendChild(baseText);
            const versionDiv = document.createElement("div");
            versionDiv.style.display = "flex";
            versionDiv.style.gap = "10px";
            versionDiv.className = "nickname";
            versionDiv.style.position = "static";
            versionDiv.style.width = "100%";
            const version = document.createElement("div");
            version.style =
                `
                    align-content: center;
                    color: #ffffff;
                    `;
            version.innerText = "version:";
            const versionText = document.createElement("input");
            versionText.type = "text";
            versionText.style.height = "20px";
            versionText.style.fontSize = "15px";
            versionText.placeholder = mod.version;
            versionText.value = mod.version;
            versionText.addEventListener("input", _ => {
                const text = versionText.value === "" ? versionText.placeholder : versionText.value;
                mod.version = text;
                console.log("Changed version");
                localStorage.setItem("polyMods", JSON.stringify(mods));
            });
            versionDiv.appendChild(version);
            versionDiv.appendChild(versionText);
            const loadedDiv = document.createElement("div");
            loadedDiv.style.display = "flex";
            loadedDiv.style.gap = "10px";
            loadedDiv.className = "nickname";
            loadedDiv.style.position = "static";
            loadedDiv.style.width = "100%";
            const loaded = document.createElement("div");
            loaded.style =
                `
                    align-content: center;
                    color: #ffffff;
                    `;
            loaded.innerText = "loaded:";
            const loadedText = document.createElement("input");
            loadedText.type = "text";
            loadedText.style.height = "20px";
            loadedText.style.fontSize = "15px";
            loadedText.placeholder = mod.loaded.toString();
            loadedText.value = mod.loaded.toString();
            loadedText.addEventListener("input", _ => {
                const text = loadedText.value === "" ? loadedText.placeholder : loadedText.value;
                let val = undefined;
                switch (text) {
                    case "true":
                        val = true;
                        break;
                    case "false":
                        val = false;
                        break;
                    default:
                        break;
                }
                let loadedVal;
                switch (loadedText.placeholder) {
                    case "true":
                        loadedVal = true;
                        break;
                    case "false":
                        loadedVal = false;
                        break;
                }
                // @ts-ignore
                mod.loaded = val !== undefined ? val : loadedVal;
                localStorage.setItem("polyMods", JSON.stringify(mods));
            });
            loadedDiv.appendChild(loaded);
            loadedDiv.appendChild(loadedText);
            dropDownDiv.appendChild(baseDiv);
            dropDownDiv.appendChild(versionDiv);
            dropDownDiv.appendChild(loadedDiv);
            modDiv.appendChild(dropDownDiv);
        });
        const delButton = document.createElement("button");
        delButton.className = "button first";
        delButton.style.flex = "1";
        delButton.style.padding = "3px";
        delButton.innerHTML = `<img src="images/cancel.svg">`;
        delButton.addEventListener("click", _ => {
            // Deleting pml is impossible, because you really dont want to delete it
            if (id === 0)
                return;
            mods.splice(id, 1);
            modDiv.remove();
        });
        dropdownDiv.appendChild(dropdownButton);
        dropdownDiv.appendChild(delButton);
        modDiv.appendChild(dropdownDiv);
        div.appendChild(modDiv);
    }
};
export const polyMod = new PolyDebug();
