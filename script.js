
// ==========================================
// BIOLOGIQ - COMPLETE MAIN JAVASCRIPT
// Navigation, Lessons, Mini-Games, Checkpoints,
// XP, Progress Tracking, Animations, and Results
// ==========================================


// ==========================================
// 1. GLOBAL VARIABLES
// ==========================================

let currentModule = 0;
let currentQuestion = 0;

let totalXP = 0;
let totalScore = 0;
let currentQuizScore = 0;

let moduleScores = [null, null, null, null];
let completedModules = [false, false, false, false];

let gameState = {
    step: 0,
    completed: false,
    attempts: 0,
    protonsUsed: 0,
    selected: []
};

let feedbackTimer = null;
let labTransitionTimer = null;


// ==========================================
// 2. SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (!target) {
        console.warn(`Screen not found: ${screenId}`);
        return;
    }

    target.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function startAdventure() {
    showScreen("prayer-screen");
}

function goToLab() {
    clearTimeout(labTransitionTimer);

    const lab = document.getElementById("lab-screen");

    if (!lab) {
        showModules();
        return;
    }

    lab.classList.remove("lab-entered");

    showScreen("lab-screen");

    // Restart the entrance animation after the screen becomes visible.
    void lab.offsetWidth;
    lab.classList.add("lab-entered");
}

function enterLab() {
    clearTimeout(labTransitionTimer);

    const lab = document.getElementById("lab-screen");

    if (!lab) {
        showModules();
        return;
    }

    lab.classList.remove("lab-entered");

    void lab.offsetWidth;
    lab.classList.add("lab-entered");

    labTransitionTimer = setTimeout(() => {
        showModules();
    }, 850);
}

function showModules() {
    clearTimeout(labTransitionTimer);
    updateModuleProgress();
    showScreen("modules-screen");
}


// ==========================================
// 3. LESSON CONTENT
// ==========================================

const lessons = [
    {
        title: "Glycolysis",
        subtitle: "The first stage of cellular respiration: breaking down glucose.",
        icon: "🍬",

        overview: "Glycolysis is the first stage of cellular respiration. It occurs in the cytoplasm of the cell and involves the breakdown of one glucose molecule, a six-carbon sugar, into two molecules of pyruvate, each containing three carbon atoms. This process does not directly require oxygen, making it an anaerobic process. Glycolysis produces a net gain of 2 ATP and 2 NADH per glucose molecule.",

        process: [
            {
                title: "1. Energy Investment Phase",
                text: "The cell uses 2 ATP molecules to phosphorylate glucose and prepare it for breakdown. Glucose is converted through several reactions into fructose-1,6-bisphosphate."
            },
            {
                title: "2. Splitting Phase",
                text: "Fructose-1,6-bisphosphate, a six-carbon molecule, is split into two three-carbon molecules. These are converted into glyceraldehyde-3-phosphate (G3P)."
            },
            {
                title: "3. Energy Payoff Phase",
                text: "The two G3P molecules undergo oxidation and several reactions. NAD+ accepts high-energy electrons and becomes NADH. ATP is also produced through substrate-level phosphorylation."
            },
            {
                title: "4. Formation of Pyruvate",
                text: "The reactions eventually produce two pyruvate molecules. Four ATP are generated in this phase, resulting in a net gain of 2 ATP after subtracting the 2 ATP initially used."
            }
        ],

        molecules: [
            ["Glucose", "The six-carbon starting molecule."],
            ["ATP", "Two ATP are used and four ATP are produced."],
            ["NADH", "Carries high-energy electrons to the ETC."],
            ["Pyruvate", "The final three-carbon product."]
        ],

        inputs: "Glucose, 2 ATP, 2 NAD+",
        outputs: "2 Pyruvate, 4 ATP gross (2 ATP net), 2 NADH",

        takeaway: "Remember: Glycolysis happens in the cytoplasm, does not directly require oxygen, and produces a net gain of 2 ATP, 2 NADH, and 2 pyruvate per glucose molecule."
    },

    {
        title: "Krebs Cycle",
        subtitle: "The cyclic pathway that extracts energy from acetyl-CoA.",
        icon: "🔄",

        overview: "The Krebs Cycle, also called the citric acid cycle, is the second major stage of aerobic cellular respiration. In eukaryotic cells, it takes place in the mitochondrial matrix. Before entering the cycle, pyruvate is converted into acetyl-CoA. Acetyl-CoA combines with oxaloacetate to form citrate, beginning a series of reactions that release carbon dioxide and transfer energy to NADH and FADH2.",

        process: [
            {
                title: "1. Formation of Citrate",
                text: "A two-carbon acetyl group from acetyl-CoA combines with four-carbon oxaloacetate to form six-carbon citrate."
            },
            {
                title: "2. Isomerization",
                text: "Citrate is rearranged into isocitrate through the action of the enzyme aconitase."
            },
            {
                title: "3. Oxidation and Carbon Dioxide Release",
                text: "Isocitrate and later alpha-ketoglutarate undergo oxidation. Carbon dioxide is released, and NAD+ is reduced to NADH."
            },
            {
                title: "4. ATP and FADH2 Production",
                text: "Further reactions produce ATP or GTP and FADH2. Succinate is oxidized into fumarate, with FAD accepting electrons."
            },
            {
                title: "5. Regeneration of Oxaloacetate",
                text: "Fumarate is converted into malate. Malate is then oxidized into oxaloacetate, regenerating the molecule needed to begin another cycle."
            }
        ],

        molecules: [
            ["Acetyl-CoA", "Two-carbon molecule that enters the cycle."],
            ["NADH", "Three molecules are produced per turn."],
            ["FADH2", "One molecule is produced per turn."],
            ["Oxaloacetate", "Regenerated at the end of the cycle."]
        ],

        inputs: "Acetyl-CoA, NAD+, FAD, ADP or GDP, Pi",
        outputs: "3 NADH, 1 FADH2, 1 ATP or GTP, 2 CO2 per turn",

        takeaway: "Remember: One turn of the Krebs Cycle produces 3 NADH, 1 FADH2, 1 ATP or GTP, and 2 CO2. Since one glucose produces two acetyl-CoA molecules, the cycle turns twice per glucose."
    },

    {
        title: "Electron Transport Chain",
        subtitle: "A series of protein complexes that transfer electrons.",
        icon: "⚡",

        overview: "The Electron Transport Chain (ETC) is the final stage of cellular respiration's electron-transfer pathway. It is located in the inner mitochondrial membrane. NADH and FADH2 deliver high-energy electrons to protein complexes and electron carriers. As electrons move through the chain, energy is released and used by certain complexes to pump hydrogen ions (H+) from the mitochondrial matrix into the intermembrane space. Oxygen serves as the final electron acceptor and combines with electrons and H+ to form water.",

        process: [
            {
                title: "1. Electron Donation",
                text: "NADH delivers electrons to Complex I, while FADH2 transfers electrons through Complex II. These electron carriers become NAD+ and FAD."
            },
            {
                title: "2. Transfer Through Electron Carriers",
                text: "Electrons move from Complex I or II to coenzyme Q, then to Complex III. Cytochrome c carries electrons from Complex III to Complex IV."
            },
            {
                title: "3. Proton Pumping",
                text: "Complexes I, III, and IV use energy released by electron transfer to pump H+ from the mitochondrial matrix into the intermembrane space. Complex II does not pump protons."
            },
            {
                title: "4. Oxygen Accepts Electrons",
                text: "At Complex IV, oxygen accepts electrons and combines with H+ to form water. This allows electron transport to continue."
            }
        ],

        molecules: [
            ["NADH", "Donates electrons to Complex I."],
            ["FADH2", "Delivers electrons through Complex II."],
            ["Oxygen", "The final electron acceptor."],
            ["Water", "Forms when oxygen accepts electrons and H+."]
        ],

        inputs: "NADH, FADH2, oxygen, H+",
        outputs: "NAD+, FAD, water, and a proton gradient",

        takeaway: "Remember: The ETC is located in the inner mitochondrial membrane. Complexes I, III, and IV pump protons. Oxygen is the final electron acceptor. The ETC establishes the proton gradient but does not directly produce ATP."
    },

    {
        title: "Chemiosmosis",
        subtitle: "Using the proton gradient to power ATP synthesis.",
        icon: "💧",

        overview: "Chemiosmosis is the movement of hydrogen ions (H+) across a selectively permeable membrane down their electrochemical gradient. During cellular respiration, the ETC builds up a high concentration of H+ in the intermembrane space. The ions then flow back into the mitochondrial matrix through ATP synthase. The energy released by this movement powers the production of ATP from ADP and inorganic phosphate (Pi).",

        process: [
            {
                title: "1. Establishing the Proton Gradient",
                text: "The electron transport chain uses energy from high-energy electrons donated by NADH and FADH2 to pump H+ from the matrix into the intermembrane space."
            },
            {
                title: "2. Building the Electrochemical Gradient",
                text: "As H+ accumulates in the intermembrane space, a difference in concentration and electrical charge develops across the inner mitochondrial membrane."
            },
            {
                title: "3. Movement Through ATP Synthase",
                text: "Hydrogen ions move down their electrochemical gradient and return to the matrix through ATP synthase, a membrane protein complex."
            },
            {
                title: "4. ATP Production",
                text: "The movement of H+ drives changes in ATP synthase that allow it to combine ADP and inorganic phosphate (Pi), forming ATP."
            }
        ],

        molecules: [
            ["H+", "Hydrogen ions that move down their gradient."],
            ["ATP Synthase", "Enzyme that produces ATP."],
            ["ADP", "Combines with inorganic phosphate."],
            ["Pi", "Inorganic phosphate used to form ATP."]
        ],

        inputs: "ADP, inorganic phosphate (Pi), proton gradient",
        outputs: "ATP",

        takeaway: "Remember: Chemiosmosis uses the proton gradient created by the ETC. Hydrogen ions flow through ATP synthase back into the matrix, powering ATP production. Together, the ETC and chemiosmosis are part of oxidative phosphorylation."
    }
];


// ==========================================
// 4. OPEN MODULE
// ==========================================

function openModule(index) {
    if (index < 0 || index >= lessons.length) return;

    clearTimeout(feedbackTimer);

    currentModule = index;

    const lesson = lessons[index];

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText("lesson-count", `MODULE 0${index + 1} OF 04`);
    setText("lesson-title", lesson.title);
    setText("lesson-subtitle", lesson.subtitle);
    setText("lesson-icon", lesson.icon);
    setText("lesson-overview", lesson.overview);
    setText("lesson-takeaway", lesson.takeaway);

    const processContainer = document.getElementById("lesson-process");
    const moleculeContainer = document.getElementById("lesson-molecules");
    const inputOutputContainer = document.getElementById("lesson-input-output");

    if (processContainer) {
        processContainer.innerHTML = lesson.process.map(step => `
            <div class="process-step">
                <strong>${step.title}</strong>
                <p>${step.text}</p>
            </div>
        `).join("");
    }

    if (moleculeContainer) {
        moleculeContainer.innerHTML = lesson.molecules.map(molecule => `
            <div class="molecule">
                <strong>${molecule[0]}</strong>
                <p>${molecule[1]}</p>
            </div>
        `).join("");
    }

    if (inputOutputContainer) {
        inputOutputContainer.innerHTML = `
            <div class="molecule">
                <strong>INPUTS</strong>
                <p>${lesson.inputs}</p>
            </div>

            <div class="molecule" style="margin-top:12px">
                <strong>OUTPUTS</strong>
                <p>${lesson.outputs}</p>
            </div>
        `;
    }

    showScreen("lesson-screen");
}


// ==========================================
// 5. INTERACTIVE MINI-GAMES
// ==========================================

const interactiveGames = [
    {
        type: "sequence",
        title: "🍬 Energy Investment Challenge",
        instructions: "Arrange the four major events of glycolysis. Select the correct stage in the order it happens.",
        question: "What happens next in glycolysis?",

        items: [
            {
                name: "Glucose is phosphorylated",
                detail: "The cell invests 2 ATP to prepare glucose for breakdown.",
                explanation: "Correct! ATP supplies energy and phosphate groups during the energy investment phase."
            },
            {
                name: "Glucose is split into two 3-carbon molecules",
                detail: "The six-carbon sugar is divided into smaller molecules.",
                explanation: "Correct! The six-carbon intermediate is split into two three-carbon molecules."
            },
            {
                name: "G3P is oxidized",
                detail: "NAD+ accepts high-energy electrons and becomes NADH.",
                explanation: "Correct! The oxidation of G3P produces NADH."
            },
            {
                name: "Pyruvate is produced",
                detail: "The pathway generates ATP and forms two pyruvate molecules.",
                explanation: "Correct! Glycolysis ends with two pyruvate molecules and a net gain of 2 ATP."
            }
        ],

        choices: [
            "G3P is oxidized",
            "Pyruvate is produced",
            "Glucose is phosphorylated",
            "Glucose is split into two 3-carbon molecules"
        ]
    },

    {
        type: "sequence",
        title: "🔄 Krebs Cycle Builder",
        instructions: "Complete the simplified Krebs Cycle by selecting the molecules in the correct order.",
        question: "Which molecule comes next in the cycle?",

        items: [
            {
                name: "Citrate",
                detail: "Acetyl-CoA combines with oxaloacetate to form citrate.",
                explanation: "Correct! Citrate is the first six-carbon molecule formed in the cycle."
            },
            {
                name: "Isocitrate",
                detail: "Citrate is rearranged by the enzyme aconitase.",
                explanation: "Correct! Aconitase converts citrate into isocitrate."
            },
            {
                name: "Alpha-ketoglutarate",
                detail: "Isocitrate is oxidized and carbon dioxide is released.",
                explanation: "Correct! This reaction produces NADH and releases CO2."
            },
            {
                name: "Succinyl-CoA",
                detail: "Alpha-ketoglutarate is converted into succinyl-CoA.",
                explanation: "Correct! This step releases another CO2 and produces NADH."
            },
            {
                name: "Succinate",
                detail: "Succinyl-CoA is converted into succinate, producing ATP or GTP.",
                explanation: "Correct! This step produces one ATP or GTP."
            },
            {
                name: "Fumarate",
                detail: "Succinate is oxidized, reducing FAD into FADH2.",
                explanation: "Correct! FAD accepts electrons as succinate becomes fumarate."
            },
            {
                name: "Malate",
                detail: "Fumarate is converted into malate.",
                explanation: "Correct! Water is added during the conversion of fumarate into malate."
            },
            {
                name: "Oxaloacetate",
                detail: "Malate is oxidized, producing NADH and regenerating oxaloacetate.",
                explanation: "Correct! Oxaloacetate is regenerated so another turn of the cycle can begin."
            }
        ],

        choices: [
            "Fumarate",
            "Citrate",
            "Oxaloacetate",
            "Succinate",
            "Isocitrate",
            "Malate",
            "Succinyl-CoA",
            "Alpha-ketoglutarate"
        ]
    },

    {
        type: "sequence",
        title: "⚡ Electron Delivery Mission",
        instructions: "Guide electrons donated by NADH through the electron transport chain. Select each carrier in the correct order until oxygen receives the electrons.",
        question: "Where do the electrons travel next?",

        items: [
            {
                name: "Complex I",
                detail: "NADH donates its electrons to Complex I.",
                explanation: "Correct! NADH transfers electrons to Complex I."
            },
            {
                name: "Coenzyme Q",
                detail: "This mobile carrier transfers electrons toward Complex III.",
                explanation: "Correct! Coenzyme Q receives electrons from Complex I or Complex II."
            },
            {
                name: "Complex III",
                detail: "Electrons are transferred through the cytochrome complex.",
                explanation: "Correct! Complex III transfers electrons to cytochrome c."
            },
            {
                name: "Cytochrome c",
                detail: "This mobile carrier transports electrons to Complex IV.",
                explanation: "Correct! Cytochrome c carries electrons from Complex III to Complex IV."
            },
            {
                name: "Complex IV",
                detail: "Electrons are transferred to the final electron acceptor.",
                explanation: "Correct! Complex IV transfers electrons to oxygen."
            },
            {
                name: "Oxygen",
                detail: "Oxygen accepts electrons and combines with H+ to form water.",
                explanation: "Correct! Oxygen is the final electron acceptor."
            }
        ],

        choices: [
            "Complex III",
            "Oxygen",
            "Coenzyme Q",
            "Complex I",
            "Complex IV",
            "Cytochrome c"
        ]
    },

    {
        type: "chemiosmosis",
        title: "💧 Power the ATP Factory",
        instructions: "Move the H+ ions through ATP synthase to help power ATP production.",
        question: "Operate the ATP synthase to produce ATP!",
        target: 5
    }
];


// ==========================================
// 6. START MINI-GAME
// ==========================================

function startMiniGame() {
    clearTimeout(feedbackTimer);

    gameState = {
        step: 0,
        completed: false,
        attempts: 0,
        protonsUsed: 0,
        selected: []
    };

    const game = interactiveGames[currentModule];

    if (!game) return;

    const title = document.getElementById("game-title");
    const instructions = document.getElementById("game-instructions");
    const finishButton = document.getElementById("game-finish-btn");
    const feedback = document.getElementById("game-feedback");

    if (title) title.textContent = game.title;
    if (instructions) instructions.textContent = game.instructions;

    if (finishButton) {
        finishButton.disabled = true;
        finishButton.textContent = "COMPLETE THE CHALLENGE FIRST";
        finishButton.classList.remove("hidden");
    }

    if (feedback) {
        feedback.className = "feedback hidden";
        feedback.textContent = "";
    }

    if (game.type === "sequence") {
        renderSequenceGame();
    } else if (game.type === "chemiosmosis") {
        renderChemiosmosisGame();
    }

    showScreen("game-screen");
}


// ==========================================
// 7. SEQUENCE GAME
// ==========================================

function renderSequenceGame() {
    const game = interactiveGames[currentModule];

    if (!game || game.type !== "sequence") return;

    if (gameState.completed) {
        renderCompletedGame();
        return;
    }

    const nextItem = game.items[gameState.step];

    if (!nextItem) return;

    const completedItems = game.items.slice(0, gameState.step);
    const gameArea = document.getElementById("game-area");

    if (!gameArea) return;

    gameArea.innerHTML = `
        <div class="game-progress">
            <div class="game-progress-label">
                <span>Pathway Progress</span>
                <strong>${gameState.step} / ${game.items.length}</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill"
                    style="width:${(gameState.step / game.items.length) * 100}%">
                </div>
            </div>
        </div>

        <div class="game-board">
            <h3>YOUR COMPLETED PATHWAY</h3>

            <div class="game-sequence">
                ${
                    completedItems.length
                    ? completedItems.map((item, index) => `
                        <div class="sequence-item filled">
                            <small>STEP ${index + 1}</small>
                            ✓ ${item.name}
                        </div>
                    `).join("")
                    : `
                        <div class="sequence-item">
                            Your pathway is empty. Select the first correct step!
                        </div>
                    `
                }
            </div>
        </div>

        <div class="game-board">
            <h3>${game.question}</h3>
            <p>${nextItem.detail}</p>

            <div class="game-choice-grid" style="margin-top:15px">
                ${game.choices.map((choice, index) => `
                    <button class="game-choice"
                        onclick="selectSequenceChoice(${index})">
                        ${choice}
                    </button>
                `).join("")}
            </div>
        </div>

        <div class="game-feedback hidden" id="interactive-feedback"></div>
    `;
}


// ==========================================
// 8. GAME COMPLETION DISPLAY
// ==========================================

function renderCompletedGame() {
    const gameArea = document.getElementById("game-area");

    if (gameArea) {
        gameArea.innerHTML = `
            <div class="game-board" style="text-align:center">
                <div style="font-size:4rem">🎉</div>
                <h2>CHALLENGE COMPLETED!</h2>
                <p>
                    You successfully completed the activity.
                    You can now proceed to your checkpoint quiz.
                </p>
            </div>
        `;
    }

    enableProceedButton();
}

function enableProceedButton() {
    const finishButton = document.getElementById("game-finish-btn");

    if (!finishButton) return;

    finishButton.disabled = false;
    finishButton.textContent = "PROCEED TO QUIZ →";
    finishButton.classList.remove("hidden");
}


// ==========================================
// 9. CHECK SEQUENCE ANSWER
// ==========================================

function selectSequenceChoice(choiceIndex) {
    if (gameState.completed) return;

    const game = interactiveGames[currentModule];

    if (!game || game.type !== "sequence") return;

    const selectedChoice = game.choices[choiceIndex];
    const correctItem = game.items[gameState.step];

    const buttons = document.querySelectorAll(".game-choice");
    const feedback = document.getElementById("interactive-feedback");

    if (!feedback || !correctItem || selectedChoice === undefined) return;

    // Prevent multiple clicks while an answer is being processed.
    if ([...buttons].some(button => button.disabled)) return;

    gameState.attempts++;

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selectedChoice === correctItem.name) {
        gameState.selected.push(selectedChoice);
        gameState.step++;

        feedback.className = "game-feedback good";
        feedback.innerHTML = `
            <strong>✓ Correct!</strong><br>
            ${correctItem.explanation}
        `;

        if (gameState.step >= game.items.length) {
            gameState.completed = true;

            feedback.innerHTML += `
                <br><br>
                <strong>🎉 Challenge completed!</strong>
                You successfully completed the pathway.
            `;

            enableProceedButton();

        } else {
            feedbackTimer = setTimeout(() => {
                if (!document.getElementById("game-screen")?.classList.contains("active")) {
                    return;
                }

                renderSequenceGame();

                showGameFeedback(
                    "Correct! Your pathway is progressing.",
                    "good"
                );
            }, 1100);
        }

    } else {
        feedback.className = "game-feedback bad";

        feedback.innerHTML = `
            <strong>✗ Not quite!</strong><br>
            That is not the next step. Review the lesson and try again.
            <br><br>
            <button class="secondary-btn" onclick="retrySequenceGame()">
                TRY AGAIN
            </button>
        `;
    }
}

function retrySequenceGame() {
    if (gameState.completed) return;

    renderSequenceGame();
}


// ==========================================
// 10. GAME FEEDBACK
// ==========================================

function showGameFeedback(message, type) {
    const feedback =
        document.getElementById("interactive-feedback") ||
        document.getElementById("game-feedback");

    if (!feedback) return;

    feedback.className = `game-feedback ${type}`;
    feedback.textContent = message;
}


// ==========================================
// 11. CHEMIOSMOSIS GAME
// ==========================================

function renderChemiosmosisGame() {
    const game = interactiveGames[3];

    if (!game) return;

    const target = game.target;
    const gameArea = document.getElementById("game-area");

    if (!gameArea) return;

    gameArea.innerHTML = `
        <div class="game-progress">
            <div class="game-progress-label">
                <span>ATP Production Progress</span>
                <strong>${gameState.protonsUsed} / ${target}</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill"
                    style="width:${(gameState.protonsUsed / target) * 100}%">
                </div>
            </div>
        </div>

        <div class="game-board">
            <h3>MITOCHONDRIAL INTERMEMBRANE SPACE</h3>

            <p>
                The ETC has pumped H+ into this space, creating a proton gradient.
                These ions are ready to move back into the matrix.
            </p>

            <div class="proton-field">
                ${
                    Array.from({
                        length: target - gameState.protonsUsed
                    }, () => `<div class="proton">H+</div>`).join("")
                    || "<p>All available protons have passed through!</p>"
                }
            </div>
        </div>

        <div class="game-board">
            <h3>⚙️ ATP SYNTHASE</h3>

            <div style="text-align:center; font-size:3.5rem; margin:12px 0;">
                ⚙️
            </div>

            <p style="text-align:center">
                H+ flows through ATP synthase and returns to the mitochondrial matrix.
                This movement provides energy for ATP production.
            </p>

            <div class="game-stat-row">
                <div class="game-stat">
                    <strong>${gameState.protonsUsed}</strong>
                    <span>H+ PASSED</span>
                </div>

                <div class="game-stat">
                    <strong>${gameState.protonsUsed}</strong>
                    <span>ATP TOKENS</span>
                </div>
            </div>

            <div class="game-control">
                <button class="primary-btn"
                    onclick="moveProton()"
                    ${gameState.completed ? "disabled" : ""}>
                    MOVE H+ THROUGH ATP SYNTHASE →
                </button>
            </div>
        </div>

        <div class="game-feedback hidden" id="interactive-feedback"></div>

        <p style="font-size:0.8rem; margin-top:12px;">
            Note: ATP tokens are used only to represent successful game actions.
            They do not represent the actual biological H+ to ATP ratio.
        </p>
    `;
}


// ==========================================
// 12. MOVE PROTON
// ==========================================

function moveProton() {
    const game = interactiveGames[3];

    if (!game) return;

    const target = game.target;

    if (gameState.completed || gameState.protonsUsed >= target) return;

    gameState.protonsUsed++;

    if (gameState.protonsUsed >= target) {
        gameState.completed = true;
        renderChemiosmosisGame();

        const feedback = document.getElementById("interactive-feedback");

        if (feedback) {
            feedback.className = "game-feedback good";
            feedback.innerHTML = `
                <strong>🎉 ATP FACTORY ACTIVATED!</strong><br>
                You successfully moved all the H+ ions through ATP synthase.
                This movement powers the formation of ATP from ADP and inorganic phosphate.
            `;
        }

        enableProceedButton();

    } else {
        renderChemiosmosisGame();

        const feedback = document.getElementById("interactive-feedback");

        if (feedback) {
            feedback.className = "game-feedback good";
            feedback.innerHTML = `
                <strong>✓ Proton successfully moved!</strong><br>
                H+ passed through ATP synthase.
                Keep going to complete ATP production!
            `;
        }
    }
}


// ==========================================
// 13. FINISH MINI-GAME
// ==========================================

// ==========================================
// 13.5 POST-MINI-GAME 3D BIOLOGY MODEL VIEWER
// ==========================================

let modelRotationPaused = false;

const biologyModels = [
    {
        title: "Glycolysis: Glucose Breakdown",
        subtitle: "Explore how one six-carbon glucose molecule is converted into two three-carbon pyruvate molecules.",
        caption: "From glucose to pyruvate",
        description: "Glycolysis takes place in the cytoplasm. The pathway invests 2 ATP, splits a six-carbon sugar into two three-carbon molecules, and produces a net gain of 2 ATP and 2 NADH.",
        facts: [["LOCATION", "Cytoplasm"], ["NET ENERGY", "2 ATP"], ["ELECTRON CARRIER", "2 NADH"], ["END PRODUCT", "2 Pyruvate"]],
        visual: `<div class="glycolysis-model model-object">
            <div class="gly-node glucose-node"><b>GLUCOSE</b><small>6-carbon</small></div>
            <div class="gly-arrow">↓</div>
            <div class="gly-node split-node"><b>FRUCTOSE-1,6-BP</b><small>Activated sugar</small></div>
            <div class="gly-split"><span>↙</span><span>↘</span></div>
            <div class="gly-pair">
                <div class="gly-node trio-node"><b>G3P</b><small>3-carbon</small></div>
                <div class="gly-node trio-node"><b>G3P</b><small>3-carbon</small></div>
            </div>
            <div class="gly-arrow">↓</div>
            <div class="gly-pair">
                <div class="gly-node pyruvate-node"><b>PYRUVATE</b><small>3-carbon</small></div>
                <div class="gly-node pyruvate-node"><b>PYRUVATE</b><small>3-carbon</small></div>
            </div>
            <div class="gly-energy"><span>−2 ATP invested</span><span>+4 ATP produced</span><span>2 NADH formed</span></div>
        </div>`
    },
    {
        title: "Krebs Cycle: The Citric Acid Cycle",
        subtitle: "Rotate through the cyclic pathway that extracts energy from acetyl-CoA.",
        caption: "A cycle that regenerates oxaloacetate",
        description: "In the mitochondrial matrix, acetyl-CoA combines with oxaloacetate to form citrate. Reactions release CO₂ and transfer energy to NADH and FADH₂, while oxaloacetate is regenerated.",
        facts: [["LOCATION", "Mitochondrial matrix"], ["PER TURN", "3 NADH"], ["ALSO PRODUCES", "1 FADH₂ + 1 ATP/GTP"], ["CARBON RELEASE", "2 CO₂"]],
        visual: `<div class="krebs-model model-object">
            <div class="krebs-ring">
                <span class="cycle-node node-a">CITRATE</span><span class="cycle-node node-b">ISOCITRATE</span>
                <span class="cycle-node node-c">α-KG</span><span class="cycle-node node-d">SUCCINATE</span>
                <span class="cycle-node node-e">FUMARATE</span><span class="cycle-node node-f">MALATE</span>
                <div class="krebs-center"><b>KREBS</b><small>CYCLE</small><span>↻</span></div>
            </div>
            <div class="krebs-output output-one">3 NADH</div><div class="krebs-output output-two">1 FADH₂</div>
            <div class="krebs-output output-three">2 CO₂</div>
        </div>`
    },
    {
        title: "Electron Transport Chain",
        subtitle: "Follow electrons through protein complexes embedded in the inner mitochondrial membrane.",
        caption: "Electron transfer builds the proton gradient",
        description: "NADH and FADH₂ donate electrons to the chain. Energy released during electron transfer is used by Complexes I, III, and IV to pump H⁺ into the intermembrane space. Oxygen is the final electron acceptor and water is formed.",
        facts: [["LOCATION", "Inner mitochondrial membrane"], ["ELECTRON DONORS", "NADH and FADH₂"], ["PROTON PUMPS", "Complexes I, III, IV"], ["FINAL ACCEPTOR", "Oxygen"]],
        visual: `<div class="etc-model model-object">
            <div class="etc-zone">INTERMEMBRANE SPACE <span>H⁺　H⁺　H⁺　H⁺</span></div>
            <div class="etc-membrane">
                <div class="etc-complex"><b>I</b><small>Complex I</small><i>↑ H⁺</i></div>
                <div class="etc-complex no-pump"><b>II</b><small>Complex II</small><i>No pump</i></div>
                <div class="etc-carrier">Q</div><div class="etc-complex"><b>III</b><small>Complex III</small><i>↑ H⁺</i></div>
                <div class="etc-carrier cyto">C</div><div class="etc-complex"><b>IV</b><small>Complex IV</small><i>↑ H⁺</i></div>
            </div>
            <div class="etc-electrons">e⁻ → → → → → →</div>
            <div class="etc-matrix">MITOCHONDRIAL MATRIX <span>O₂ + e⁻ + H⁺ → H₂O</span></div>
        </div>`
    },
    {
        title: "Chemiosmosis: ATP Synthesis",
        subtitle: "See how hydrogen ions flow through ATP synthase to power ATP production.",
        caption: "The proton gradient drives ATP synthase",
        description: "The ETC creates a high concentration of H⁺ in the intermembrane space. Hydrogen ions flow down their electrochemical gradient through ATP synthase and back into the matrix. This movement powers ATP formation from ADP and inorganic phosphate.",
        facts: [["GRADIENT", "High H⁺ outside the matrix"], ["PROTON PATHWAY", "ATP synthase"], ["INPUTS", "ADP + Pi"], ["OUTPUT", "ATP"]],
        visual: `<div class="chemo-model model-object">
            <div class="chemo-space">INTERMEMBRANE SPACE <span class="proton-cloud">H⁺　H⁺　H⁺　H⁺　H⁺</span></div>
            <div class="chemo-membrane"><div class="atp-synthase"><div class="atp-head">F₀</div><div class="atp-stem"></div><div class="atp-head f1">F₁</div></div><div class="proton-flow">H⁺ ↓</div></div>
            <div class="chemo-matrix">MITOCHONDRIAL MATRIX<div class="atp-reaction"><span>ADP + Pi</span><b>→</b><strong>ATP</strong></div></div>
        </div>`
    }
];

function showBiologyModel(index) {
    const model = biologyModels[index];
    if (!model) return startCheckpoint();

    modelRotationPaused = false;
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    setText("model-title", model.title);
    setText("model-subtitle", model.subtitle);
    setText("model-caption-title", model.caption);
    setText("model-description", model.description);

    const visual = document.getElementById("model-visual");
    if (visual) visual.innerHTML = model.visual;

    const facts = document.getElementById("model-facts");
    if (facts) facts.innerHTML = model.facts.map(([label, value]) =>
        `<div class="model-fact"><small>${label}</small><strong>${value}</strong></div>`
    ).join("");

    const button = document.getElementById("model-rotate-btn");
    if (button) button.textContent = "PAUSE ROTATION";
    showScreen("model-screen");
}

function toggleModelRotation() {
    modelRotationPaused = !modelRotationPaused;
    const visual = document.getElementById("model-visual");
    const button = document.getElementById("model-rotate-btn");
    if (visual) visual.classList.toggle("rotation-paused", modelRotationPaused);
    if (button) button.textContent = modelRotationPaused ? "RESUME ROTATION" : "PAUSE ROTATION";
}

function continueFromModel() {
    startCheckpoint();
}


function finishMiniGame() {
    if (!gameState.completed) {
        showGameFeedback(
            "Complete the challenge first before proceeding to the 3D model!",
            "bad"
        );
        return;
    }

    clearTimeout(feedbackTimer);
    showBiologyModel(currentModule);
}


// ==========================================
// 14. CHECKPOINT QUIZZES
// IMPORTANT: ALL QUESTIONS ARE UNCHANGED.
// ==========================================

const quizzes = [

    // GLYCOLYSIS
    [
        {
            question: "Which part of the cell is responsible for carrying out glycolysis?",
            options: ["Nucleus", "Cytoplasm", "Mitochondria", "Cell membrane"],
            answer: 1,
            explanation: [
                "The nucleus stores genetic information and does not carry out glycolysis.",
                "Correct! Glycolysis takes place in the cytoplasm of the cell.",
                "The mitochondria are involved in later stages of cellular respiration.",
                "The cell membrane regulates the movement of substances but is not the site of glycolysis."
            ]
        },
        {
            question: "What substance is broken down during glycolysis to release energy?",
            options: ["Protein", "Glucose", "Oxygen", "Water"],
            answer: 1,
            explanation: [
                "Proteins are not the main starting substance in glycolysis.",
                "Correct! Glucose, a six-carbon sugar, is broken down into two pyruvate molecules.",
                "Oxygen is not broken down during glycolysis.",
                "Water is not the starting substance of glycolysis."
            ]
        },
        {
            question: "Why does glycolysis require ATP at the beginning of the process?",
            options: [
                "To provide energy that helps prepare glucose for breakdown",
                "To produce oxygen for the cell",
                "To turn pyruvate into glucose",
                "To create more glucose molecules"
            ],
            answer: 0,
            explanation: [
                "Correct! ATP supplies energy and phosphate groups that help prepare glucose for breakdown during the energy investment phase.",
                "Glycolysis does not produce oxygen.",
                "Glycolysis breaks glucose down into pyruvate; it does not turn pyruvate into glucose.",
                "ATP is used to prepare glucose for breakdown, not to create more glucose."
            ]
        },
        {
            question: "During glycolysis, what does NAD+ become after accepting high-energy electrons?",
            options: ["ATP", "Pyruvate", "NADH", "Glucose"],
            answer: 2,
            explanation: [
                "ATP is an energy-carrying molecule, not the reduced form of NAD+.",
                "Pyruvate is the final product of glycolysis.",
                "Correct! NAD+ accepts high-energy electrons and becomes NADH.",
                "Glucose is the starting molecule of glycolysis."
            ]
        },
        {
            question: "If PFK-1 is inhibited, which stage of glycolysis is directly affected?",
            options: [
                "The conversion of glucose into glucose-6-phosphate",
                "The conversion of fructose-6-phosphate into fructose-1,6-bisphosphate",
                "The conversion of phosphoenolpyruvate into pyruvate",
                "The conversion of pyruvate into lactate"
            ],
            answer: 1,
            explanation: [
                "This reaction is catalyzed by hexokinase or glucokinase.",
                "Correct! PFK-1 catalyzes the conversion of fructose-6-phosphate into fructose-1,6-bisphosphate. It is an important regulatory step in glycolysis.",
                "This reaction is catalyzed by pyruvate kinase.",
                "The conversion of pyruvate into lactate is associated with fermentation, not the PFK-1 reaction."
            ]
        }
    ],

    // KREBS CYCLE
    [
        {
            question: "Where does the Krebs Cycle primarily take place in the mitochondrion?",
            options: [
                "Inner mitochondrial membrane",
                "Intermembrane space",
                "Mitochondrial matrix",
                "Outer mitochondrial membrane"
            ],
            answer: 2,
            explanation: [
                "The inner mitochondrial membrane contains the electron transport chain.",
                "The intermembrane space is where protons accumulate during electron transport.",
                "Correct! The Krebs Cycle primarily occurs in the mitochondrial matrix.",
                "The outer mitochondrial membrane is not the primary location of the Krebs Cycle."
            ]
        },
        {
            question: "Which enzyme catalyzes the conversion of citrate into isocitrate?",
            options: ["Citrate synthase", "Aconitase", "Fumarase", "Malate dehydrogenase"],
            answer: 1,
            explanation: [
                "Citrate synthase catalyzes the formation of citrate from acetyl-CoA and oxaloacetate.",
                "Correct! Aconitase rearranges citrate into isocitrate.",
                "Fumarase catalyzes the conversion of fumarate into malate.",
                "Malate dehydrogenase catalyzes the conversion of malate into oxaloacetate."
            ]
        },
        {
            question: "What are the products generated during one complete turn of the Krebs Cycle?",
            options: [
                "2 NADH, 2 FADH2, 1 ATP, and 1 CO2",
                "3 NADH, 1 FADH2, 1 ATP (GTP), and 2 CO2",
                "1 NADH, 3 FADH2, 2 ATP, and 2 CO2",
                "3 NADH, 2 FADH2, 2 ATP, and 1 CO2"
            ],
            answer: 1,
            explanation: [
                "This option has incorrect quantities of the products.",
                "Correct! One turn produces 3 NADH, 1 FADH2, 1 ATP or GTP, and 2 CO2.",
                "This option has incorrect quantities of NADH, FADH2, and ATP.",
                "This option has incorrect quantities of FADH2, ATP, and CO2."
            ]
        },
        {
            question: "During the oxidation of succinate, which molecule accepts electrons and becomes reduced to FADH2?",
            options: ["NAD+", "ATP", "Coenzyme A", "FAD"],
            answer: 3,
            explanation: [
                "NAD+ accepts electrons in other oxidation reactions of the Krebs Cycle.",
                "ATP is an energy-carrying molecule and does not become FADH2.",
                "Coenzyme A participates in acetyl-CoA formation and related reactions.",
                "Correct! FAD accepts electrons during the oxidation of succinate and is reduced to FADH2."
            ]
        },
        {
            question: "What happens during the final step of the Krebs Cycle?",
            options: [
                "Citrate is converted into isocitrate.",
                "Succinate is converted into fumarate.",
                "Malate is oxidized into oxaloacetate, regenerating the starting molecule of the cycle.",
                "Acetyl-CoA combines with oxaloacetate to form citrate."
            ],
            answer: 2,
            explanation: [
                "This occurs near the beginning of the cycle.",
                "This is an earlier reaction involving succinate dehydrogenase.",
                "Correct! Malate is oxidized into oxaloacetate, regenerating the molecule needed for another turn of the cycle.",
                "This reaction begins the cycle rather than ending it."
            ]
        }
    ],

    // ELECTRON TRANSPORT CHAIN
    [
        {
            question: "What is the role of oxygen in the ETC?",
            options: [
                "Pumps protons",
                "Makes ATP directly",
                "Final electron acceptor",
                "Carries electrons from glycolysis"
            ],
            answer: 2,
            explanation: [
                "Oxygen does not pump protons. Certain ETC complexes perform proton pumping.",
                "Oxygen does not directly make ATP.",
                "Correct! Oxygen is the final electron acceptor in the electron transport chain.",
                "NADH and FADH2 deliver electrons to the ETC."
            ]
        },
        {
            question: "What do NADH and FADH2 do in the ETC?",
            options: [
                "Split water",
                "Store glucose",
                "Make ATP synthase",
                "Deliver high-energy electrons"
            ],
            answer: 3,
            explanation: [
                "NADH and FADH2 do not split water.",
                "They are electron carriers, not glucose storage molecules.",
                "ATP synthase is a protein complex already present in the inner mitochondrial membrane.",
                "Correct! NADH and FADH2 deliver high-energy electrons to the electron transport chain."
            ]
        },
        {
            question: "What creates the proton gradient?",
            options: [
                "ATP synthase",
                "Pumping of H+ by the ETC",
                "Glycolysis",
                "The Krebs Cycle"
            ],
            answer: 1,
            explanation: [
                "ATP synthase allows H+ to flow down its gradient and uses that energy to produce ATP.",
                "Correct! The ETC uses energy from electron transfer to pump H+ across the inner mitochondrial membrane.",
                "Glycolysis takes place in the cytoplasm and does not create the mitochondrial proton gradient.",
                "The Krebs Cycle produces electron carriers but does not directly pump H+ across the inner mitochondrial membrane."
            ]
        },
        {
            question: "Where in the cell is the ETC located?",
            options: [
                "Cytosol",
                "Inner mitochondrial membrane",
                "Mitochondrial matrix",
                "Nucleus"
            ],
            answer: 1,
            explanation: [
                "The cytosol is where glycolysis occurs.",
                "Correct! The ETC is located in the inner mitochondrial membrane.",
                "The mitochondrial matrix is where the Krebs Cycle takes place.",
                "The nucleus is not the location of the ETC."
            ]
        },
        {
            question: "What is formed when oxygen accepts electrons and H+ at the end of the chain?",
            options: ["CO2", "Glucose", "NADH", "Water"],
            answer: 3,
            explanation: [
                "CO2 is released during pyruvate oxidation and the Krebs Cycle.",
                "Glucose is the starting fuel for cellular respiration.",
                "NADH donates electrons to the ETC.",
                "Correct! Oxygen combines with electrons and H+ to form water."
            ]
        }
    ],

    // CHEMIOSMOSIS
    [
        {
            question: "Chemiosmosis describes the movement of _____ across a membrane to produce ATP.",
            options: [
                "Electrons",
                "Hydrogen ions (H+)",
                "Oxygen molecules",
                "NADH"
            ],
            answer: 1,
            explanation: [
                "Electrons move through the electron transport chain, not through ATP synthase during chemiosmosis.",
                "Correct! Chemiosmosis involves the movement of hydrogen ions (H+) down their electrochemical gradient across a membrane.",
                "Oxygen serves as the final electron acceptor in the ETC.",
                "NADH donates electrons to the ETC; it does not pass through ATP synthase."
            ]
        },
        {
            question: "Where is the H+ concentration highest when chemiosmosis begins?",
            options: [
                "Mitochondrial matrix",
                "Intermembrane space",
                "Cytoplasm",
                "Nucleus"
            ],
            answer: 1,
            explanation: [
                "The mitochondrial matrix has a lower H+ concentration compared with the intermembrane space at this stage.",
                "Correct! H+ accumulates in the intermembrane space because the ETC pumps hydrogen ions out of the matrix.",
                "The cytoplasm is not the location of the mitochondrial proton gradient.",
                "The nucleus is not involved in mitochondrial chemiosmosis."
            ]
        },
        {
            question: "What is the role of oxygen in the electron transport chain and chemiosmosis?",
            options: [
                "It pumps H+ ions across the membrane.",
                "It carries electrons to ATP synthesis.",
                "It is the final electron acceptor, allowing the electron transport chain to continue functioning.",
                "It directly catalyzes ATP formation."
            ],
            answer: 2,
            explanation: [
                "The ETC complexes, not oxygen, pump H+ across the membrane.",
                "Cytochrome c and other electron carriers transfer electrons through the ETC.",
                "Correct! Oxygen accepts electrons at the end of the ETC, allowing electron transport to continue and water to form.",
                "ATP synthase catalyzes ATP formation."
            ]
        },
        {
            question: "The energy that creates the H+ gradient used in chemiosmosis comes directly from:",
            options: [
                "Sunlight",
                "ATP already stored in the cell",
                "High-energy electrons from NADH and FADH2",
                "Carbon dioxide"
            ],
            answer: 2,
            explanation: [
                "Sunlight is used during photosynthesis, not directly to create the mitochondrial proton gradient.",
                "The gradient is established by proton pumping powered by electron transport, not by ATP already stored in the cell.",
                "Correct! Energy released as high-energy electrons from NADH and FADH2 move through the ETC powers proton pumping.",
                "Carbon dioxide is a product of earlier stages of cellular respiration."
            ]
        },
        {
            question: "Which enzyme allows H+ ions to pass through the inner mitochondrial membrane during chemiosmosis?",
            options: [
                "ATP synthase",
                "Cytochrome c",
                "NADH dehydrogenase",
                "Hexokinase"
            ],
            answer: 0,
            explanation: [
                "Correct! ATP synthase provides a pathway for H+ to flow back into the mitochondrial matrix and uses the released energy to produce ATP.",
                "Cytochrome c is an electron carrier between Complex III and Complex IV.",
                "NADH dehydrogenase is Complex I of the ETC and participates in electron transfer and proton pumping.",
                "Hexokinase is an enzyme involved in the first step of glycolysis."
            ]
        }
    ]
];


// ==========================================
// 15. START CHECKPOINT
// ==========================================

function startCheckpoint() {
    if (!quizzes[currentModule]) return;

    currentQuestion = 0;
    currentQuizScore = 0;

    // Reset this module's score for a new attempt.
    moduleScores[currentModule] = 0;

    const title = document.getElementById("checkpoint-title");
    const topic = document.getElementById("checkpoint-topic-label");
    const scoreDisplay = document.getElementById("live-quiz-score");

    if (title) {
        title.textContent = lessons[currentModule].title + " Quiz";
    }

    if (topic) {
        topic.textContent = lessons[currentModule].title.toUpperCase();
    }

    if (scoreDisplay) {
        scoreDisplay.textContent = "0 / 5";
    }

    showCheckpointQuestion();
    showScreen("checkpoint-screen");
}


// ==========================================
// 16. DISPLAY QUESTION
// ==========================================

function showCheckpointQuestion() {
    const question = quizzes[currentModule]?.[currentQuestion];

    if (!question) return;

    const number = document.getElementById("checkpoint-number");
    const progress = document.getElementById("checkpoint-progress");
    const questionText = document.getElementById("checkpoint-question");
    const optionsContainer = document.getElementById("checkpoint-options");
    const feedback = document.getElementById("checkpoint-feedback");
    const nextButton = document.getElementById("checkpoint-next");

    if (number) {
        number.textContent = `Question ${currentQuestion + 1} of 5`;
    }

    if (progress) {
        progress.style.width = `${((currentQuestion + 1) / 5) * 100}%`;
    }

    if (questionText) {
        questionText.textContent = question.question;
    }

    if (optionsContainer) {
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <button class="option-btn" onclick="answerCheckpoint(${index})">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span>${option}</span>
            </button>
        `).join("");
    }

    if (feedback) {
        feedback.className = "feedback hidden";
        feedback.textContent = "";
    }

    if (nextButton) {
        nextButton.classList.add("hidden");
    }
}


// ==========================================
// 17. ANSWER CHECKPOINT
// ==========================================

function answerCheckpoint(selectedIndex) {
    const question = quizzes[currentModule]?.[currentQuestion];

    if (!question) return;

    const buttons = document.querySelectorAll(
        "#checkpoint-options .option-btn"
    );

    // Prevent answering more than once.
    if (!buttons.length || buttons[0].disabled) return;

    if (selectedIndex < 0 || selectedIndex >= question.options.length) return;

    const isCorrect = selectedIndex === question.answer;

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && !isCorrect) {
            button.classList.add("wrong");
        }
    });

    const feedback = document.getElementById("checkpoint-feedback");

    if (isCorrect) {
        currentQuizScore++;

        moduleScores[currentModule] = currentQuizScore;

        if (feedback) {
            feedback.className = "feedback good";
            feedback.innerHTML = `
                <strong>✓ Correct Answer!</strong><br>
                ${question.explanation[selectedIndex]}
            `;
        }

    } else {
        if (feedback) {
            feedback.className = "feedback bad";
            feedback.innerHTML = `
                <strong>✗ Incorrect Answer.</strong><br>
                ${question.explanation[selectedIndex]}
                <br><br>
                <strong>Correct answer:</strong>
                ${String.fromCharCode(65 + question.answer)}.
                ${question.options[question.answer]}
                <br>
                ${question.explanation[question.answer]}
            `;
        }
    }

    const scoreDisplay = document.getElementById("live-quiz-score");

    if (scoreDisplay) {
        scoreDisplay.textContent = `${currentQuizScore} / 5`;
    }

    const nextButton = document.getElementById("checkpoint-next");

    if (nextButton) {
        nextButton.classList.remove("hidden");
        nextButton.textContent =
            currentQuestion === 4
                ? "VIEW MODULE RESULT →"
                : "NEXT QUESTION →";
    }
}


// ==========================================
// 18. NEXT QUESTION
// ==========================================

function nextCheckpointQuestion() {
    // Do not proceed if the current question has not been answered.
    const buttons = document.querySelectorAll(
        "#checkpoint-options .option-btn"
    );

    if (!buttons.length || !buttons[0].disabled) return;

    if (currentQuestion < 4) {
        currentQuestion++;
        showCheckpointQuestion();
    } else {
        finishCheckpoint();
    }
}


// ==========================================
// 19. FINISH CHECKPOINT
// ==========================================

function finishCheckpoint() {
    const score = currentQuizScore;

    moduleScores[currentModule] = score;

    // Recalculate total score using the latest module scores.
    totalScore = moduleScores.reduce(
        (sum, value) => sum + (value ?? 0),
        0
    );

    const xpEarned = 20 + (score * 10);
    const xpDisplay = document.getElementById("checkpoint-xp-earned");

    // Award XP only the first time a module is completed.
    if (!completedModules[currentModule]) {
        totalXP += xpEarned;
        completedModules[currentModule] = true;

        if (xpDisplay) {
            xpDisplay.textContent = `+${xpEarned} XP`;
        }
    } else {
        if (xpDisplay) {
            xpDisplay.textContent = "Module already completed - XP unchanged";
        }
    }

    const scoreElement = document.getElementById("checkpoint-score");
    const resultTitle = document.getElementById("checkpoint-result-title");
    const resultMessage = document.getElementById("checkpoint-result-message");

    if (scoreElement) {
        scoreElement.textContent = `${score} / 5`;
    }

    if (resultTitle) {
        resultTitle.textContent =
            score >= 4 ? "Excellent Work!" : "Keep Learning!";
    }

    if (resultMessage) {
        resultMessage.textContent =
            score === 5
                ? "Perfect score! You have mastered this topic."
                : score >= 3
                ? "Good job! Review the explanations to strengthen your understanding."
                : "Keep practicing. Revisit the lesson and learn from the feedback.";
    }

    updateXP();
    updateModuleProgress();

    showScreen("checkpoint-result-screen");
}


// ==========================================
// 20. UPDATE XP
// ==========================================

function updateXP() {
    const xpDisplay =
        document.getElementById("xp-display") ||
        document.getElementById("xp");

    if (xpDisplay) {
        xpDisplay.textContent = `⚡ ${totalXP} XP`;
    }
}


// ==========================================
// 21. UPDATE MODULE PROGRESS
// ==========================================

function updateModuleProgress() {
    const completed = completedModules.filter(Boolean).length;

    const label = document.getElementById("module-progress-label");
    const progress = document.getElementById("module-progress");

    if (label) {
        label.textContent = `${completed} / 4 completed`;
    }

    if (progress) {
        progress.style.width = `${(completed / 4) * 100}%`;
    }

    completedModules.forEach((isComplete, index) => {
        const status = document.getElementById(`status-${index}`);

        if (status) {
            status.textContent = isComplete ? "✓ COMPLETED" : "NOT STARTED";
        }
    });
}


// ==========================================
// 22. CONTINUE TO NEXT MODULE
// ==========================================

function continueAfterCheckpoint() {
    if (currentModule < lessons.length - 1) {
        openModule(currentModule + 1);
    } else {
        showFinalResults();
    }
}


// ==========================================
// 23. FINAL RESULTS
// ==========================================

function showFinalResults() {
    totalScore = moduleScores.reduce(
        (sum, value) => sum + (value ?? 0),
        0
    );

    const scoreElement = document.getElementById("final-score");
    const xpElement = document.getElementById("final-xp");
    const messageElement = document.getElementById("final-message");
    const breakdown = document.getElementById("final-breakdown");

    if (scoreElement) scoreElement.textContent = `${totalScore} / 20`;
    if (xpElement) xpElement.textContent = totalXP;

    let message = "";
    if (totalScore >= 18) {
        message = "Outstanding! You demonstrated excellent understanding of cellular respiration.";
    } else if (totalScore >= 15) {
        message = "Great work! You have a strong understanding of the four stages.";
    } else if (totalScore >= 10) {
        message = "Good effort! Review the lessons to strengthen your understanding.";
    } else {
        message = "Your learning journey does not end here. Revisit the modules and keep exploring!";
    }

    if (messageElement) messageElement.textContent = message;

    if (breakdown) {
        breakdown.innerHTML = lessons.map((lesson, index) => {
            const score = moduleScores[index] ?? 0;
            const percentage = (score / 5) * 100;
            return `
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <strong>${lesson.title}</strong>
                        <span>${score}/5</span>
                    </div>
                    <div class="breakdown-track">
                        <div class="breakdown-fill" style="width:${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join("");
    }

    const percentElement = document.getElementById("final-percentage");
    if (percentElement) {
        percentElement.textContent = `${Math.round((totalScore / 20) * 100)}%`;
    }

    showScreen("final-screen");
}

// ==========================================
// 24. RESTART ADVENTURE
// ==========================================

function restartAdventure() {
    clearTimeout(feedbackTimer);
    clearTimeout(labTransitionTimer);

    currentModule = 0;
    currentQuestion = 0;

    totalXP = 0;
    totalScore = 0;
    currentQuizScore = 0;

    moduleScores = [null, null, null, null];
    completedModules = [false, false, false, false];

    gameState = {
        step: 0,
        completed: false,
        attempts: 0,
        protonsUsed: 0,
        selected: []
    };

    updateXP();
    updateModuleProgress();

    const scoreDisplay = document.getElementById("live-quiz-score");

    if (scoreDisplay) {
        scoreDisplay.textContent = "0 / 5";
    }

    const finishButton = document.getElementById("game-finish-btn");

    if (finishButton) {
        finishButton.disabled = true;
        finishButton.textContent = "COMPLETE THE CHALLENGE FIRST";
    }

    showScreen("home-screen");
}


// ==========================================
// 25. ANIMATED LABORATORY ATMOSPHERE
// ==========================================

function initializeLabAtmosphere() {
    const particleContainer = document.getElementById("lab-particles");
    const bubbleContainer = document.getElementById("lab-bubbles");

    if (particleContainer) {
        particleContainer.innerHTML = "";

        for (let i = 0; i < 45; i++) {
            const particle = document.createElement("span");

            particle.className = "lab-particle";

            particle.style.setProperty(
                "--left",
                `${Math.random() * 100}%`
            );

            particle.style.setProperty(
                "--size",
                `${Math.random() * 4 + 2}px`
            );

            particle.style.setProperty(
                "--duration",
                `${Math.random() * 12 + 10}s`
            );

            particle.style.setProperty(
                "--delay",
                `${Math.random() * -20}s`
            );

            particle.style.setProperty(
                "--drift",
                `${Math.random() * 100 - 50}px`
            );

            particleContainer.appendChild(particle);
        }
    }

    if (bubbleContainer) {
        bubbleContainer.innerHTML = "";

        for (let i = 0; i < 18; i++) {
            const bubble = document.createElement("span");

            bubble.className = "lab-bubble";

            bubble.style.setProperty(
                "--left",
                `${Math.random() * 100}%`
            );

            bubble.style.setProperty(
                "--size",
                `${Math.random() * 25 + 12}px`
            );

            bubble.style.setProperty(
                "--duration",
                `${Math.random() * 15 + 15}s`
            );

            bubble.style.setProperty(
                "--delay",
                `${Math.random() * -25}s`
            );

            bubble.style.setProperty(
                "--drift",
                `${Math.random() * 100 - 50}px`
            );

            bubbleContainer.appendChild(bubble);
        }
    }
}


// ==========================================
// 26. INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    updateXP();
    updateModuleProgress();

    initializeLabAtmosphere();

    const finishButton = document.getElementById("game-finish-btn");

    if (finishButton) {
        finishButton.disabled = true;
        finishButton.textContent = "COMPLETE THE CHALLENGE FIRST";
    }

    // Ensure the first screen is visible if none is active.
    const activeScreen = document.querySelector(".screen.active");

    if (!activeScreen) {
        const homeScreen = document.getElementById("home-screen");

        if (homeScreen) {
            homeScreen.classList.add("active");
        }
    }
});

// ============================================================
// BIOLOGIQ UPDATE
// SCIENTIST SNAKE TEST + PROGRESSION LOCKS + SAVED PROGRESS
// Add this block at the VERY BOTTOM of your existing script.js.
// ============================================================


// ------------------------------------------------------------
// 1. SAVED PROGRESS
// ------------------------------------------------------------

const BIOLOGIQ_SAVE_KEY = "BIOLOGIQ_STUDENT_PROGRESS";

let snakeTestCompleted = false;
let snakeGame = null;

function saveBiologiqProgress() {
    const progress = {
        totalXP,
        moduleScores,
        completedModules,
        snakeTestCompleted
    };

    try {
        localStorage.setItem(
            BIOLOGIQ_SAVE_KEY,
            JSON.stringify(progress)
        );
    } catch (error) {
        console.warn("Unable to save BIOLOGIQ progress:", error);
    }
}

function loadBiologiqProgress() {
    try {
        const saved = localStorage.getItem(BIOLOGIQ_SAVE_KEY);

        if (!saved) return;

        const progress = JSON.parse(saved);

        if (!progress || typeof progress !== "object") return;

        totalXP = Number(progress.totalXP) || 0;

        if (
            Array.isArray(progress.moduleScores) &&
            progress.moduleScores.length === 4
        ) {
            moduleScores = progress.moduleScores.map(score =>
                score === null ? null : Math.max(0, Math.min(5, Number(score) || 0))
            );
        }

        if (
            Array.isArray(progress.completedModules) &&
            progress.completedModules.length === 4
        ) {
            completedModules = progress.completedModules.map(Boolean);
        }

        snakeTestCompleted = Boolean(progress.snakeTestCompleted);

        totalScore = moduleScores.reduce(
            (sum, score) => sum + (score ?? 0),
            0
        );

    } catch (error) {
        console.warn("Unable to load BIOLOGIQ progress:", error);
    }
}


// ------------------------------------------------------------
// 2. MODULE UNLOCKING
// ------------------------------------------------------------

function getFirstIncompleteModule() {
    return completedModules.findIndex(completed => !completed);
}

function isModuleUnlocked(index) {
    if (!snakeTestCompleted) return false;

    if (index < 0 || index >= lessons.length) return false;

    const firstIncomplete = getFirstIncompleteModule();

    // All modules are available after completing all four.
    if (firstIncomplete === -1) return true;

    // Previously completed modules can always be revisited.
    if (completedModules[index]) return true;

    // Only the next incomplete module is unlocked.
    return index <= firstIncomplete;
}

function updateModuleProgress() {
    const completed = completedModules.filter(Boolean).length;

    const label = document.getElementById("module-progress-label");
    const progress = document.getElementById("module-progress");

    if (label) {
        label.textContent = `${completed} / 4 completed`;
    }

    if (progress) {
        progress.style.width = `${(completed / 4) * 100}%`;
    }

    completedModules.forEach((isComplete, index) => {
        const status = document.getElementById(`status-${index}`);
        const card = document.querySelector(
            `.module-card[onclick="openModule(${index})"]`
        );

        if (!status) return;

        if (isComplete) {
            status.textContent = "✓ COMPLETED";
        } else if (isModuleUnlocked(index)) {
            status.textContent = "AVAILABLE";
        } else {
            status.textContent = "🔒 LOCKED";
        }

        if (card) {
            card.disabled = !isModuleUnlocked(index);
            card.classList.toggle("module-locked", !isModuleUnlocked(index));
            card.classList.toggle("module-completed", isComplete);
        }
    });
}


// ------------------------------------------------------------
// 3. SCIENTIST SNAKE SCREEN
// ------------------------------------------------------------

function createSnakeScreen() {
    if (document.getElementById("snake-screen")) return;

    const main = document.querySelector("main");
    if (!main) return;

    const screen = document.createElement("section");

    screen.id = "snake-screen";
    screen.className = "screen";

    screen.innerHTML = `
        <div class="section-heading">
            <p class="eyebrow">REQUIRED PRE-LESSON CHALLENGE</p>
            <h1>🧑‍🔬 Scientist Snake Test</h1>
            <p>
                Help the scientist collect six carbon molecules.
                Collect all six to form one glucose molecule and unlock
                your cellular respiration lessons!
            </p>
        </div>

        <div style="
            width:min(100%,720px);
            margin:25px auto;
            padding:20px;
            background:rgba(16,44,50,.96);
            border:1px solid rgba(255,255,255,.12);
            border-radius:20px;
            box-sizing:border-box;
        ">
            <div style="
                display:flex;
                justify-content:space-between;
                gap:12px;
                flex-wrap:wrap;
                margin-bottom:15px;
                color:#f3fbf9;
            ">
                <strong>🧑‍🔬 SCIENTIST</strong>
                <strong id="snake-score">Carbon collected: 0 / 6</strong>
            </div>

            <canvas
                id="snake-canvas"
                width="640"
                height="384"
                style="
                    display:block;
                    width:100%;
                    max-width:640px;
                    margin:auto;
                    background:#071b20;
                    border:2px solid #35d0bd;
                    border-radius:12px;
                    touch-action:none;
                "
                aria-label="Scientist Snake game board"
            ></canvas>

            <p id="snake-message" style="
                text-align:center;
                color:#a9c4c1;
                margin:16px 0;
            ">
                Use the arrow keys or directional controls to move.
                Collect six carbon molecules.
            </p>

            <div style="
                display:grid;
                grid-template-columns:repeat(3,65px);
                justify-content:center;
                gap:8px;
                margin:18px auto;
            ">
                <span></span>
                <button class="secondary-btn snake-control" data-direction="up">▲</button>
                <span></span>

                <button class="secondary-btn snake-control" data-direction="left">◀</button>
                <button class="secondary-btn snake-control" data-direction="down">▼</button>
                <button class="secondary-btn snake-control" data-direction="right">▶</button>
            </div>

            <div style="
                display:flex;
                justify-content:center;
                gap:12px;
                flex-wrap:wrap;
            ">
                <button class="primary-btn" id="snake-start-btn">
                    START GAME →
                </button>

                <button class="secondary-btn" id="snake-retry-btn">
                    RESTART
                </button>
            </div>

            <div id="snake-success" style="
                display:none;
                text-align:center;
                margin-top:25px;
                padding:20px;
                background:rgba(53,208,189,.12);
                border:1px solid #35d0bd;
                border-radius:14px;
            ">
                <div style="font-size:3rem">🧬</div>
                <h2 style="color:#35d0bd">GLUCOSE FORMED!</h2>
                <p>
                    Excellent! You collected six carbon molecules.
                    The Scientist Snake Test is complete.
                </p>
                <button class="primary-btn" id="snake-continue-btn">
                    UNLOCK MY LESSONS →
                </button>
            </div>
        </div>
    `;

    main.appendChild(screen);

    document.getElementById("snake-start-btn")
        ?.addEventListener("click", startSnakeGame);

    document.getElementById("snake-retry-btn")
        ?.addEventListener("click", startSnakeGame);

    document.getElementById("snake-continue-btn")
        ?.addEventListener("click", () => {
            snakeTestCompleted = true;
            saveBiologiqProgress();
            updateModuleProgress();
            showModules();
        });

    document.querySelectorAll(".snake-control").forEach(button => {
        button.addEventListener("click", () => {
            changeSnakeDirection(button.dataset.direction);
        });
    });

    const canvas = document.getElementById("snake-canvas");

    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener("touchstart", event => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    canvas.addEventListener("touchend", event => {
        const touch = event.changedTouches[0];

        const differenceX = touch.clientX - touchStartX;
        const differenceY = touch.clientY - touchStartY;

        if (Math.abs(differenceX) > Math.abs(differenceY)) {
            changeSnakeDirection(
                differenceX > 0 ? "right" : "left"
            );
        } else if (Math.abs(differenceY) > 0) {
            changeSnakeDirection(
                differenceY > 0 ? "down" : "up"
            );
        }
    }, { passive: true });
}


// ------------------------------------------------------------
// 4. SCIENTIST SNAKE GAME LOGIC
// ------------------------------------------------------------

const SNAKE_CELL = 32;
const SNAKE_COLUMNS = 20;
const SNAKE_ROWS = 12;
const SNAKE_TARGET = 6;

const SNAKE_DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

function createNewSnakeState() {
    return {
        body: [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ],
        direction: "right",
        nextDirection: "right",
        food: { x: 12, y: 5 },
        score: 0,
        running: false,
        gameOver: false,
        timer: null
    };
}

function createSnakeFood() {
    let food;

    do {
        food = {
            x: Math.floor(Math.random() * SNAKE_COLUMNS),
            y: Math.floor(Math.random() * SNAKE_ROWS)
        };
    } while (
        snakeGame.body.some(
            part => part.x === food.x && part.y === food.y
        )
    );

    return food;
}

function changeSnakeDirection(direction) {
    if (!snakeGame || !snakeGame.running) return;

    const current = SNAKE_DIRECTIONS[snakeGame.direction];
    const next = SNAKE_DIRECTIONS[direction];

    if (!next) return;

    // Prevent reversing directly into the snake's body.
    if (
        current.x + next.x === 0 &&
        current.y + next.y === 0
    ) {
        return;
    }

    snakeGame.nextDirection = direction;
}

function startSnakeGame() {
    stopSnakeGame();

    snakeGame = createNewSnakeState();

    const success = document.getElementById("snake-success");
    const message = document.getElementById("snake-message");
    const startButton = document.getElementById("snake-start-btn");

    if (success) success.style.display = "none";
    if (message) {
        message.textContent = "Collect six carbon molecules. Avoid the walls and your own body!";
    }

    if (startButton) startButton.style.display = "none";

    snakeGame.running = true;

    drawSnakeGame();

    snakeGame.timer = setInterval(
        updateSnakeGame,
        220
    );
}

function stopSnakeGame() {
    if (snakeGame?.timer) {
        clearInterval(snakeGame.timer);
    }
}

function updateSnakeGame() {
    if (!snakeGame || !snakeGame.running) return;

    snakeGame.direction = snakeGame.nextDirection;

    const direction = SNAKE_DIRECTIONS[snakeGame.direction];

    const head = {
        x: snakeGame.body[0].x + direction.x,
        y: snakeGame.body[0].y + direction.y
    };

    // Wall collision.
    if (
        head.x < 0 ||
        head.x >= SNAKE_COLUMNS ||
        head.y < 0 ||
        head.y >= SNAKE_ROWS
    ) {
        endSnakeGame();
        return;
    }

    const eating = (
        head.x === snakeGame.food.x &&
        head.y === snakeGame.food.y
    );

    const collisionBody = eating
        ? snakeGame.body
        : snakeGame.body.slice(0, -1);

    // Self collision.
    if (
        collisionBody.some(
            part => part.x === head.x && part.y === head.y
        )
    ) {
        endSnakeGame();
        return;
    }

    snakeGame.body.unshift(head);

    if (eating) {
        snakeGame.score++;

        if (snakeGame.score >= SNAKE_TARGET) {
            completeSnakeGame();
            return;
        }

        snakeGame.food = createSnakeFood();
    } else {
        snakeGame.body.pop();
    }

    drawSnakeGame();
}

function drawSnakeGame() {
    const canvas = document.getElementById("snake-canvas");
    const scoreLabel = document.getElementById("snake-score");

    if (!canvas || !snakeGame) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#071b20";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid.
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += SNAKE_CELL) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += SNAKE_CELL) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Carbon molecule.
    const foodX = snakeGame.food.x * SNAKE_CELL;
    const foodY = snakeGame.food.y * SNAKE_CELL;

    ctx.fillStyle = "#35d0bd";
    ctx.beginPath();
    ctx.arc(
        foodX + SNAKE_CELL / 2,
        foodY + SNAKE_CELL / 2,
        13,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#071b20";
    ctx.font = "bold 17px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        "C",
        foodX + SNAKE_CELL / 2,
        foodY + SNAKE_CELL / 2
    );

    // Scientist snake.
    snakeGame.body.forEach((part, index) => {
        const x = part.x * SNAKE_CELL;
        const y = part.y * SNAKE_CELL;

        ctx.fillStyle = index === 0 ? "#f3fbf9" : "#159b91";

        ctx.beginPath();
        ctx.roundRect(
            x + 3,
            y + 3,
            SNAKE_CELL - 6,
            SNAKE_CELL - 6,
            8
        );
        ctx.fill();

        if (index === 0) {
            ctx.font = "23px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
                "🧑‍🔬",
                x + SNAKE_CELL / 2,
                y + SNAKE_CELL / 2
            );
        }
    });

    if (scoreLabel) {
        scoreLabel.textContent =
            `Carbon collected: ${snakeGame.score} / ${SNAKE_TARGET}`;
    }
}

function endSnakeGame() {
    stopSnakeGame();

    snakeGame.running = false;
    snakeGame.gameOver = true;

    const message = document.getElementById("snake-message");
    const startButton = document.getElementById("snake-start-btn");

    if (message) {
        message.textContent =
            "The scientist bumped into an obstacle! Restart the game and try again.";
    }

    if (startButton) {
        startButton.style.display = "inline-flex";
        startButton.textContent = "TRY AGAIN →";
    }
}

function completeSnakeGame() {
    stopSnakeGame();

    snakeGame.running = false;
    snakeGame.gameOver = true;

    drawSnakeGame();

    const message = document.getElementById("snake-message");
    const success = document.getElementById("snake-success");

    if (message) {
        message.textContent =
            "You successfully collected all six carbon molecules!";
    }

    if (success) {
        success.style.display = "block";
    }

    const startButton = document.getElementById("snake-start-btn");

    if (startButton) {
        startButton.style.display = "none";
    }
}


// ------------------------------------------------------------
// 5. CONNECT THE SNAKE TEST TO BIOLOGIQ
// ------------------------------------------------------------

// The opening prayer and laboratory entrance remain unchanged.
// After entering the lab, first-time students must complete
// the Scientist Snake Test.

enterLab = function () {
    clearTimeout(labTransitionTimer);

    const lab = document.getElementById("lab-screen");

    if (lab) {
        lab.classList.remove("lab-entered");
        void lab.offsetWidth;
        lab.classList.add("lab-entered");
    }

    labTransitionTimer = setTimeout(() => {
        if (snakeTestCompleted) {
            showModules();
        } else {
            showSnakeTest();
        }
    }, 850);
};

function showSnakeTest() {
    createSnakeScreen();
    showScreen("snake-screen");

    if (!snakeGame || snakeGame.gameOver) {
        const startButton = document.getElementById("snake-start-btn");

        if (startButton) {
            startButton.style.display = "inline-flex";
            startButton.textContent = "START GAME →";
        }

        drawSnakeGameIfAvailable();
    }
}

function drawSnakeGameIfAvailable() {
    if (!snakeGame) {
        snakeGame = createNewSnakeState();
    }

    drawSnakeGame();
}


// ------------------------------------------------------------
// 6. PROTECT MODULE ACCESS
// ------------------------------------------------------------

const originalOpenModule = openModule;

openModule = function (index) {
    if (!snakeTestCompleted) {
        showSnakeTest();
        return;
    }

    if (!isModuleUnlocked(index)) {
        alert(
            "Complete the previous learning module before unlocking this one."
        );
        return;
    }

    originalOpenModule(index);
};


// Prevent bypassing the required Snake Test through navigation.
const originalShowModules = showModules;

showModules = function () {
    if (!snakeTestCompleted) {
        showSnakeTest();
        return;
    }

    clearTimeout(labTransitionTimer);
    updateModuleProgress();
    showScreen("modules-screen");
};


// ------------------------------------------------------------
// 7. SAVE QUIZ RESULTS AND KEEP BEST SCORES
// ------------------------------------------------------------

const originalFinishCheckpoint = finishCheckpoint;

finishCheckpoint = function () {
    const previousBest = moduleScores[currentModule] ?? 0;
    const currentAttempt = currentQuizScore;

    originalFinishCheckpoint();

    // Keep the highest score when a student retakes a quiz.
    moduleScores[currentModule] = Math.max(
        previousBest,
        currentAttempt
    );

    totalScore = moduleScores.reduce(
        (sum, score) => sum + (score ?? 0),
        0
    );

    saveBiologiqProgress();
    updateModuleProgress();
};


// ------------------------------------------------------------
// 8. UPDATE CONTINUE BUTTON BEHAVIOR
// ------------------------------------------------------------

continueAfterCheckpoint = function () {
    saveBiologiqProgress();

    if (currentModule < lessons.length - 1) {
        const nextModule = currentModule + 1;

        if (isModuleUnlocked(nextModule)) {
            openModule(nextModule);
        } else {
            showModules();
        }
    } else {
        showFinalResults();
    }
};


// ------------------------------------------------------------
// 9. REVISITING MODULES WITHOUT LOSING PROGRESS
// ------------------------------------------------------------

restartAdventure = function () {
    clearTimeout(feedbackTimer);
    clearTimeout(labTransitionTimer);

    stopSnakeGame();

    currentModule = 0;
    currentQuestion = 0;
    currentQuizScore = 0;

    gameState = {
        step: 0,
        completed: false,
        attempts: 0,
        protonsUsed: 0,
        selected: []
    };

    updateXP();
    updateModuleProgress();

    // This returns the student to the first lesson without
    // deleting saved quiz scores, XP, or unlocked modules.
    if (snakeTestCompleted) {
        showModules();
    } else {
        showScreen("home-screen");
    }
};


// ------------------------------------------------------------
// 10. KEYBOARD CONTROLS
// ------------------------------------------------------------

document.addEventListener("keydown", event => {
    if (!document.getElementById("snake-screen")?.classList.contains("active")) {
        return;
    }

    const keys = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        W: "up",
        s: "down",
        S: "down",
        a: "left",
        A: "left",
        d: "right",
        D: "right"
    };

    const direction = keys[event.key];

    if (direction) {
        event.preventDefault();
        changeSnakeDirection(direction);
    }
});


// ------------------------------------------------------------
// 11. INITIALIZE SAVED PROGRESS
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    loadBiologiqProgress();

    createSnakeScreen();

    updateXP();
    updateModuleProgress();

    // Refresh the module locks after loading saved progress.
    if (!snakeTestCompleted) {
        updateModuleProgress();
    }
});
// ==========================================
// REVISIT SCIENTIST SNAKE GAME
// ==========================================

function replaySnakeGame() {
    // Make sure the Snake screen exists.
    createSnakeScreen();

    // Stop any previous game.
    stopSnakeGame();

    // Open the Snake Game screen.
    showScreen("snake-screen");

    // Start a fresh game.
    startSnakeGame();
}