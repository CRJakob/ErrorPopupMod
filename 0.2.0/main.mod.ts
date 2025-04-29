// import { PolyMod, PolyModLoader } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";
// If the below line is uncommented in main branch, then scream at me
import { PolyMod, PolyModLoader } from "../PolyModLoader/PolyModLoader.js";

class PolyDebug extends PolyMod {
    pml: PolyModLoader

    init = (pmlInstance: PolyModLoader) => {
        this.pml = pmlInstance;

        window.addEventListener("error", e => {
            const { error } = e;
            this.#showCrashScreen(error);
        });
        window.addEventListener("unhandledrejection", e => {
            const { reason } = e;
            this.#showCrashScreen(reason);
        });
    }

    simInit = () => {
        throw TypeError("die");
    }

    #showCrashScreen(err: any) {
        // some hacky init stuff copied from pmlcore
        const menuDiv = document.getElementById("ui")!;
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
            this.#showModDebugScreen(containerDiv);
        });
        buttonWrapper.appendChild(button);

        // in a prototype so i can call it later in the back button in the debug screen
        this.#showCrashScreen.prototype.populateMsg = function () {
            const msg = err instanceof Error ? err.stack : `(Custom error message): ${err}`;
            textDiv.innerHTML =
                `
                <h1>Oh no, PolyTrack has crashed!</h1>
                <p>Here is the error message so that you can report it:</p>
                <pre style="white-space: pre-wrap"e><code>${msg}</code></pre>
                `;
            containerDiv.appendChild(textDiv);
        }
        this.#showCrashScreen.prototype.populateMsg();
        containerDiv.appendChild(buttonWrapper);
        mainDiv.appendChild(containerDiv);
        if (mainDivCreated) menuDiv.appendChild(mainDiv);
    }

    #showModDebugScreen(div: HTMLDivElement) {
        const mods: Array<{ base: string, version: string, loaded: boolean }> = JSON.parse(window.localStorage.getItem("polyMods")!);

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
            dropdownButton.innerHTML = `<img src="images/arrow_right.svg">  ${id}`;
            dropdownButton.dataset.dropped = "false";
            dropdownButton.addEventListener("click", _ => {
                if (dropdownButton.dataset.dropped! === "true") {
                    document.getElementById(`debugscreen-dropdown${id}`)?.remove();
                    dropdownButton.innerHTML = `<img src="images/arrow_right.svg">  ${id}`;
                    dropdownButton.dataset.dropped = "false";
                    return;
                }

                dropdownButton.innerHTML = `<img src="images/arrow_down.svg">  ${id}`;
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
                baseText.addEventListener("input", _ => {
                    const text = baseText.value === "" ? baseText.placeholder : baseText.value;
                    mod.base = text;
                    throw text;
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
                versionText.addEventListener("input", _ => {
                    const text = versionText.value === "" ? versionText.placeholder : versionText.value;
                    mod.version = text;
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
                loadedText.addEventListener("input", _ => {
                    const text = loadedText.value === "" ? loadedText.placeholder : loadedText.value;
                    let val: boolean | undefined = undefined;
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
                    mod.base = val !== undefined ? val.toString() : loadedText.placeholder;
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
            delButton.innerHTML = `<img src="images/cancel.svg"; margin-bottom: 5px>`

            dropdownDiv.appendChild(dropdownButton);
            dropdownDiv.appendChild(delButton);
            modDiv.appendChild(dropdownDiv);
            div.appendChild(modDiv);
        }
    }
}

export const polyMod = new PolyDebug();
