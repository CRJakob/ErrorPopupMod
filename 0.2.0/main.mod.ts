import { PolyMod, PolyModLoader } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";
// If the below line is uncommented in main branch, then scream at me
// import { PolyMod, PolyModLoader } from "../PolyModLoader/PolyModLoader.js";

class PolyDebug extends PolyMod {
    pml: PolyModLoader
    confirm: HTMLDialogElement
    console: HTMLDialogElement

    init = (pmlInstance: PolyModLoader) => {
        this.pml = pmlInstance;

        // Setup the confirm dialog for deleting mods in localstorage editor
        {
            this.confirm = document.createElement("dialog");
            this.confirm.id = "delete-mod-confirm";
            this.confirm.className = "hidden";
            const confirmDiv = document.createElement("div");
            confirmDiv.style = "transform: scale(0.32375)";
            const warning = document.createElement("p");
            warning.innerText = "Are you sure you want to delete this mod?";
            const yes = document.createElement("button");
            yes.className = "button";
            yes.innerText = "Yes";
            yes.addEventListener("click", _ => this.confirm.close("1"));
            const no = document.createElement("button");
            no.className = "button";
            no.innerText = "No";
            no.addEventListener("click", _ => this.confirm.close("0"));

            confirmDiv.appendChild(warning);
            confirmDiv.appendChild(yes);
            confirmDiv.appendChild(no);

            this.confirm.appendChild(confirmDiv);
            document.body.appendChild(this.confirm);
        }

        // Setup console popup stuff
        // reference: https://stackoverflow.com/a/67449524
        {
            const formatter = Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                fractionalSecondDigits: 3,
                hour12: false,
            });
            function hookLogType(logType: LogType) {
                const original = console[logType].bind(console)
                return (function () {
                    this.#updateConsole(logType, formatter.format(Date.now()), Array.from(arguments));
                    original.apply(console, arguments);
                }).bind(this);
            }
            // @ts-ignore
            // i hate javascript
            hookLogType = hookLogType.bind(this);

            ['log', 'error', 'warn', 'debug', 'info'].forEach(logType => {
                // @ts-ignore
                console[logType] = hookLogType(logType);
            });

            this.console = document.createElement("dialog");
            this.console.id = "console-box";
            this.console.className = "hidden";
            const consoleDiv = document.createElement("div");
            consoleDiv.className = "container";
            consoleDiv.style.top = "5%";
            consoleDiv.style.left = "calc(50% - 75% / 2)";
            consoleDiv.style.height = "90%";
            consoleDiv.style.width = "75%";
            consoleDiv.style.textAlign = "left";
            consoleDiv.style.overflow = "scroll";

            this.console.addEventListener("close", _ => {
                this.console.className = "hidden";
            });
            this.console.appendChild(consoleDiv);
            document.body.appendChild(this.console);

            this.pml.registerBindCategory("PolyDebug");
            this.pml.registerKeybind("Show Console", "show_console", "keydown", "KeyC", null, (_: any) => this.#showConsoleScreen());
        }

        // Error popup stuff
        window.addEventListener("error", e => {
            const { error } = e;
            this.#showCrashScreen(error);
        });
        window.addEventListener("unhandledrejection", e => {
            const { reason } = e;
            this.#showCrashScreen(reason);
        });

        this.pml.registerKeybind("Crash Game", "crash_game", "keydown", "KeyY", null, (_: any) => { throw TypeError("die"); });
    }

    #showConsoleScreen() {
        this.console.className = "message-box message";
        this.console.showModal();
    }

    #updateConsole(logType: LogType, time: string, args: Array<any>) {
        // @ts-ignore
        const consoleDiv: HTMLDivElement = this.console.children[0];

        const messageDiv = document.createElement("div");
        const timeDiv = document.createElement("div");
        timeDiv.style.color = "#ADACA5";
        timeDiv.style.fontSize = "15px";
        timeDiv.innerText = `[${logType.toUpperCase()} at ${time}]`;
        const textDiv = document.createElement("div");
        textDiv.style.color = (() => {
            switch (logType) {
                case LogType.Log: return "#FFFCE9";
                case LogType.Info: return "#CAF2FD";
                case LogType.Debug: return "#CD62D9";
                case LogType.Warn: return "#FAFF58";
                case LogType.Error: return "#F42955";

                default: return "#FFFFFF";
            }
        })();
        textDiv.style.fontSize = "20px";
        let msg = '<pre style="margin: 0px">> ';
        function stringify(obj: any): string {
            if (obj instanceof Error) return obj.stack!;
            else if (obj instanceof Function) return `(function ${obj.name})`;
            else if (obj instanceof Array) {
                if (obj.length === 0) return "[]";

                let str = `[ ${stringify(obj[0])}`;
                for (const obj1 of obj.slice(1)) {
                    str += `, ${stringify(obj1)}`;
                }
                str += " ]";
                return str;
            } else if (typeof obj === "object") {
                try { return JSON.stringify(obj, undefined, 2); } catch { return obj.toString(); }
            } else return obj.toString();
        }
        for (const arg of args) {
            msg += `${stringify(arg)}&nbsp;`;
        }
        msg += "</pre><hr />";
        textDiv.innerHTML = msg;

        messageDiv.appendChild(timeDiv);
        messageDiv.appendChild(textDiv);
        consoleDiv.appendChild(messageDiv);
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
        button.innerHTML = "Go to localstorage editor";
        button.addEventListener("click", _ => {
            textDiv.remove();
            containerDiv.innerHTML = "";
            this.#showModDebugScreen(containerDiv);
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
            dropdownButton.innerHTML = `<img src="images/arrow_right.svg">&nbsp;${id}`;
            dropdownButton.dataset.dropped = "false";
            dropdownButton.addEventListener("click", _ => {
                if (dropdownButton.dataset.dropped! === "true") {
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
                    let loadedVal: boolean;
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
                if (id === 0) return;

                this.confirm.className = "message-box confirm";
                this.confirm.onclose = _ => {
                    switch (this.confirm.returnValue) {
                        case "1": {
                            mods.splice(id, 1);
                            modDiv.remove();

                            localStorage.setItem("polyMods", JSON.stringify(mods));

                            break;
                        }

                        case "0":
                        case "default":
                        default:
                            return;
                    }

                    this.confirm.className = "hidden";
                };
                this.confirm.showModal();
            });

            dropdownDiv.appendChild(dropdownButton);
            dropdownDiv.appendChild(delButton);
            modDiv.appendChild(dropdownDiv);
            div.appendChild(modDiv);
        }
    }
}

// ['log', 'error', 'warn', 'debug', 'info']
enum LogType {
    Log = "log",
    Info = "info",
    Debug = "debug",
    Warn = "warn",
    Error = "error",
}

export const polyMod = new PolyDebug();
