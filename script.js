
// ==========================================
// BIOLOGIQ - COMPLETE MAIN JAVASCRIPT
// FIXED GAME PROGRESSION AND QUIZ SCORING
// ==========================================

// ==========================================
// 1. GLOBAL VARIABLES
// ==========================================

let currentModule = 0;
let currentQuestion = 0;

let totalXP = 0;
let totalScore = 0;

let moduleScores = [null, null, null, null];
let completedModules = [false, false, false, false];

let currentQuizScore = 0;

let gameState = {
    step: 0,
    completed: false,
    attempts: 0,
    protonsUsed: 0,
    selected: []
};

// ==========================================
// 2. SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function startAdventure() {
    showScreen("prayer-screen");
}

function goToLab() {
    showScreen("lab-screen");
}

function enterLab() {
    const lab = document.getElementById("lab-screen");

    if (!lab) {
        showModules();
        return;
    }

    lab.classList.remove("lab-entered");
    void lab.offsetWidth;
    lab.classList.add("lab-entered");

    setTimeout(() => {
        showModules();
    }, 850);
}

function showModules() {
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

        overview:
            "Glycolysis is the first stage of cellular respiration. It occurs in the cytoplasm of the cell and involves the breakdown of one glucose molecule, a six-carbon sugar, into two molecules of pyruvate, each containing three carbon atoms. This process does not directly require oxygen, making it an anaerobic process. Glycolysis produces a net gain of 2 ATP and 2 NADH per glucose molecule.",

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

        takeaway:
            "Remember: Glycolysis happens in the cytoplasm, does not directly require oxygen, and produces a net gain of 2 ATP, 2 NADH, and 2 pyruvate per glucose molecule."
    },

    {
        title: "Krebs Cycle",
        subtitle: "The cyclic pathway that extracts energy from acetyl-CoA.",
        icon: "🔄",

        overview:
            "The Krebs Cycle, also called the citric acid cycle, is the second major stage of aerobic cellular respiration. In eukaryotic cells, it takes place in the mitochondrial matrix. Before entering the cycle, pyruvate is converted into acetyl-CoA. Acetyl-CoA combines with oxaloacetate to form citrate, beginning a series of reactions that release carbon dioxide and transfer energy to NADH and FADH2.",

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

        takeaway:
            "Remember: One turn of the Krebs Cycle produces 3 NADH, 1 FADH2, 1 ATP or GTP, and 2 CO2. Since one glucose produces two acetyl-CoA molecules, the cycle turns twice per glucose."
    },

    {
        title: "Electron Transport Chain",
        subtitle: "A series of protein complexes that transfer electrons.",
        icon: "⚡",

        overview:
            "The Electron Transport Chain (ETC) is the final stage of cellular respiration's electron-transfer pathway. It is located in the inner mitochondrial membrane. NADH and FADH2 deliver high-energy electrons to protein complexes and electron carriers. As electrons move through the chain, energy is released and used by certain complexes to pump hydrogen ions (H+) from the mitochondrial matrix into the intermembrane space. Oxygen serves as the final electron acceptor and combines with electrons and H+ to form water.",

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

        takeaway:
            "Remember: The ETC is located in the inner mitochondrial membrane. Complexes I, III, and IV pump protons. Oxygen is the final electron acceptor. The ETC establishes the proton gradient but does not directly produce ATP."
    },

    {
        title: "Chemiosmosis",
        subtitle: "Using the proton gradient to power ATP synthesis.",
        icon: "💧",

        overview:
            "Chemiosmosis is the movement of hydrogen ions (H+) across a selectively permeable membrane down their electrochemical gradient. During cellular respiration, the ETC builds up a high concentration of H+ in the intermembrane space. The ions then flow back into the mitochondrial matrix through ATP synthase. The energy released by this movement powers the production of ATP from ADP and inorganic phosphate (Pi).",

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

        takeaway:
            "Remember: Chemiosmosis uses the proton gradient created by the ETC. Hydrogen ions flow through ATP synthase back into the matrix, powering ATP production. Together, the ETC and chemiosmosis are part of oxidative phosphorylation."
    }
];

// ==========================================
// 4. OPEN MODULE
// ==========================================

function openModule(index) {
    if (index < 0 || index >= lessons.length) return;

    currentModule = index;

    const lesson = lessons[index];

    document.getElementById("lesson-count").textContent =
        `MODULE 0${index + 1} OF 04`;

    document.getElementById("lesson-title").textContent =
        lesson.title;

    document.getElementById("lesson-subtitle").textContent =
        lesson.subtitle;

    document.getElementById("lesson-icon").textContent =
        lesson.icon;

    document.getElementById("lesson-overview").textContent =
        lesson.overview;

    document.getElementById("lesson-takeaway").textContent =
        lesson.takeaway;

    document.getElementById("lesson-process").innerHTML =
        lesson.process.map(step => `
            <div class="process-step">
                <strong>${step.title}</strong>
                <p>${step.text}</p>
            </div>
        `).join("");

    document.getElementById("lesson-molecules").innerHTML =
        lesson.molecules.map(molecule => `
            <div class="molecule">
                <strong>${molecule[0]}</strong>
                <p>${molecule[1]}</p>
            </div>
        `).join("");

    document.getElementById("lesson-input-output").innerHTML = `
        <div class="molecule">
            <strong>INPUTS</strong>
            <p>${lesson.inputs}</p>
        </div>

        <div class="molecule" style="margin-top:12px">
            <strong>OUTPUTS</strong>
            <p>${lesson.outputs}</p>
        </div>
    `;

    showScreen("lesson-screen");
}

// ==========================================
// 5. INTERACTIVE MINI-GAMES
// ==========================================

const interactiveGames = [

    // GLYCOLYSIS
    {
        type: "sequence",
        title: "🍬 Energy Investment Challenge",

        instructions:
            "Arrange the four major events of glycolysis. Select the correct stage in the order it happens.",

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

    // KREBS CYCLE
    {
        type: "sequence",
        title: "🔄 Krebs Cycle Builder",

        instructions:
            "Complete the simplified Krebs Cycle by selecting the molecules in the correct order.",

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

    // ELECTRON TRANSPORT CHAIN
    {
        type: "sequence",
        title: "⚡ Electron Delivery Mission",

        instructions:
            "Guide electrons donated by NADH through the electron transport chain. Select each carrier in the correct order until oxygen receives the electrons.",

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

    // CHEMIOSMOSIS
    {
        type: "chemiosmosis",
        title: "💧 Power the ATP Factory",

        instructions:
            "Move the H+ ions through ATP synthase to help power ATP production.",

        question: "Operate the ATP synthase to produce ATP!",

        target: 5
    }
];

// ==========================================
// 6. START MINI-GAME
// ==========================================

function startMiniGame() {

    gameState = {
        step: 0,
        completed: false,
        attempts: 0,
        protonsUsed: 0,
        selected: []
    };

    const game = interactiveGames[currentModule];

    document.getElementById("game-title").textContent =
        game.title;

    document.getElementById("game-instructions").textContent =
        game.instructions;

    const finishButton =
        document.getElementById("game-finish-btn");

    finishButton.disabled = true;
    finishButton.textContent = "COMPLETE THE CHALLENGE FIRST";

    const feedback =
        document.getElementById("game-feedback");

    feedback.className = "feedback hidden";
    feedback.textContent = "";

    if (game.type === "sequence") {
        renderSequenceGame();
    } else {
        renderChemiosmosisGame();
    }

    showScreen("game-screen");
}

// ==========================================
// 7. SEQUENCE GAME
// ==========================================

function renderSequenceGame() {

    const game = interactiveGames[currentModule];

    if (gameState.completed) {
        renderCompletedGame();
        return;
    }

    const nextItem = game.items[gameState.step];

    const completedItems =
        game.items.slice(0, gameState.step);

    document.getElementById("game-area").innerHTML = `
        <div class="game-progress">

            <div class="game-progress-label">
                <span>Pathway Progress</span>
                <strong>
                    ${gameState.step} / ${game.items.length}
                </strong>
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

        <div class="game-feedback hidden"
            id="interactive-feedback">
        </div>
    `;
}

// ==========================================
// 8. GAME COMPLETION DISPLAY
// ==========================================

function renderCompletedGame() {

    document.getElementById("game-area").innerHTML = `
        <div class="game-board" style="text-align:center">

            <div style="font-size:4rem">🎉</div>

            <h2>CHALLENGE COMPLETED!</h2>

            <p>
                You successfully completed the activity.
                You can now proceed to your checkpoint quiz.
            </p>

        </div>
    `;

    enableProceedButton();
}

function enableProceedButton() {

    const finishButton =
        document.getElementById("game-finish-btn");

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

    const selectedChoice =
        game.choices[choiceIndex];

    const correctItem =
        game.items[gameState.step];

    const buttons =
        document.querySelectorAll(".game-choice");

    const feedback =
        document.getElementById("interactive-feedback");

    if (!feedback || !correctItem) return;

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

            setTimeout(() => {

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

            That is not the next step.
            Review the lesson and try again.

            <br><br>

            <button class="secondary-btn"
                onclick="renderSequenceGame()">
                TRY AGAIN
            </button>
        `;
    }
}

// ==========================================
// 10. GAME FEEDBACK
// ==========================================

function showGameFeedback(message, type) {

    const feedback =
        document.getElementById("interactive-feedback");

    if (!feedback) return;

    feedback.className = `game-feedback ${type}`;

    feedback.textContent = message;
}

// ==========================================
// 11. CHEMIOSMOSIS GAME
// ==========================================

function renderChemiosmosisGame() {

    const target = interactiveGames[3].target;

    document.getElementById("game-area").innerHTML = `

        <div class="game-progress">

            <div class="game-progress-label">
                <span>ATP Production Progress</span>

                <strong>
                    ${gameState.protonsUsed} / ${target}
                </strong>
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
                    }, () => `
                        <div class="proton">H+</div>
                    `).join("")
                    ||
                    "<p>All available protons have passed through!</p>"
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

        <div class="game-feedback hidden"
            id="interactive-feedback">
        </div>

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

    const target = interactiveGames[3].target;

    if (gameState.completed) return;

    if (gameState.protonsUsed >= target) return;

    gameState.protonsUsed++;

    if (gameState.protonsUsed >= target) {

        gameState.completed = true;

        renderChemiosmosisGame();

        const finalFeedback =
            document.getElementById("interactive-feedback");

        finalFeedback.className = "game-feedback good";

        finalFeedback.innerHTML = `
            <strong>🎉 ATP FACTORY ACTIVATED!</strong><br>

            You successfully moved all the H+ ions through ATP synthase.
            This movement powers the formation of ATP from ADP and inorganic phosphate.
        `;

        enableProceedButton();

    } else {

        renderChemiosmosisGame();

        const updatedFeedback =
            document.getElementById("interactive-feedback");

        updatedFeedback.className = "game-feedback good";

        updatedFeedback.innerHTML = `
            <strong>✓ Proton successfully moved!</strong><br>

            H+ passed through ATP synthase.
            Keep going to complete ATP production!
        `;
    }
}

// ==========================================
// 13. FINISH MINI-GAME
// ==========================================

function finishMiniGame() {

    if (!gameState.completed) {

        showGameFeedback(
            "Complete the challenge first before proceeding to the quiz!",
            "bad"
        );

        return;
    }

    startCheckpoint();
}

// ==========================================
// 14. CHECKPOINT QUIZZES
// ==========================================


const quizzes = [

    // =====================================
    // GLYCOLYSIS
    // =====================================
    [
        {
            question: "Which part of the cell is responsible for carrying out glycolysis?",
            options: [
                "Nucleus",
                "Cytoplasm",
                "Mitochondria",
                "Cell membrane"
            ],
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
            options: [
                "Protein",
                "Glucose",
                "Oxygen",
                "Water"
            ],
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
            question: "During glycolysis, what does NAD⁺ become after accepting high-energy electrons?",
            options: [
                "ATP",
                "Pyruvate",
                "NADH",
                "Glucose"
            ],
            answer: 2,
            explanation: [
                "ATP is an energy-carrying molecule, not the reduced form of NAD⁺.",
                "Pyruvate is the final product of glycolysis.",
                "Correct! NAD⁺ accepts high-energy electrons and becomes NADH.",
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

    // =====================================
    // KREBS CYCLE
    // =====================================
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
            options: [
                "Citrate synthase",
                "Aconitase",
                "Fumarase",
                "Malate dehydrogenase"
            ],
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
                "2 NADH, 2 FADH₂, 1 ATP, and 1 CO₂",
                "3 NADH, 1 FADH₂, 1 ATP (GTP), and 2 CO₂",
                "1 NADH, 3 FADH₂, 2 ATP, and 2 CO₂",
                "3 NADH, 2 FADH₂, 2 ATP, and 1 CO₂"
            ],
            answer: 1,
            explanation: [
                "This option has incorrect quantities of the products.",
                "Correct! One turn produces 3 NADH, 1 FADH₂, 1 ATP or GTP, and 2 CO₂.",
                "This option has incorrect quantities of NADH, FADH₂, and ATP.",
                "This option has incorrect quantities of FADH₂, ATP, and CO₂."
            ]
        },
        {
            question: "During the oxidation of succinate, which molecule accepts electrons and becomes reduced to FADH₂?",
            options: [
                "NAD⁺",
                "ATP",
                "Coenzyme A",
                "FAD"
            ],
            answer: 3,
            explanation: [
                "NAD⁺ accepts electrons in other oxidation reactions of the Krebs Cycle.",
                "ATP is an energy-carrying molecule and does not become FADH₂.",
                "Coenzyme A participates in acetyl-CoA formation and related reactions.",
                "Correct! FAD accepts electrons during the oxidation of succinate and is reduced to FADH₂."
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

    // =====================================
    // ELECTRON TRANSPORT CHAIN (ETC)
    // =====================================
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
                "NADH and FADH₂ deliver electrons to the ETC."
            ]
        },
        {
            question: "What do NADH and FADH₂ do in the ETC?",
            options: [
                "Split water",
                "Store glucose",
                "Make ATP synthase",
                "Deliver high-energy electrons"
            ],
            answer: 3,
            explanation: [
                "NADH and FADH₂ do not split water.",
                "They are electron carriers, not glucose storage molecules.",
                "ATP synthase is a protein complex already present in the inner mitochondrial membrane.",
                "Correct! NADH and FADH₂ deliver high-energy electrons to the electron transport chain."
            ]
        },
        {
            question: "What creates the proton gradient?",
            options: [
                "ATP synthase",
                "Pumping of H⁺ by the ETC",
                "Glycolysis",
                "The Krebs Cycle"
            ],
            answer: 1,
            explanation: [
                "ATP synthase allows H⁺ to flow down its gradient and uses that energy to produce ATP.",
                "Correct! The ETC uses energy from electron transfer to pump H⁺ across the inner mitochondrial membrane.",
                "Glycolysis takes place in the cytoplasm and does not create the mitochondrial proton gradient.",
                "The Krebs Cycle produces electron carriers but does not directly pump H⁺ across the inner mitochondrial membrane."
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
            question: "What is formed when oxygen accepts electrons and H⁺ at the end of the chain?",
            options: [
                "CO₂",
                "Glucose",
                "NADH",
                "Water"
            ],
            answer: 3,
            explanation: [
                "CO₂ is released during pyruvate oxidation and the Krebs Cycle.",
                "Glucose is the starting fuel for cellular respiration.",
                "NADH donates electrons to the ETC.",
                "Correct! Oxygen combines with electrons and H⁺ to form water."
            ]
        }
    ],

    // =====================================
    // CHEMIOSMOSIS
    // =====================================
    [
        {
            question: "Chemiosmosis describes the movement of _____ across a membrane to produce ATP.",
            options: [
                "Electrons",
                "Hydrogen ions (H⁺)",
                "Oxygen molecules",
                "NADH"
            ],
            answer: 1,
            explanation: [
                "Electrons move through the electron transport chain, not through ATP synthase during chemiosmosis.",
                "Correct! Chemiosmosis involves the movement of hydrogen ions (H⁺) down their electrochemical gradient across a membrane.",
                "Oxygen serves as the final electron acceptor in the ETC.",
                "NADH donates electrons to the ETC; it does not pass through ATP synthase."
            ]
        },
        {
            question: "Where is the H⁺ concentration highest when chemiosmosis begins?",
            options: [
                "Mitochondrial matrix",
                "Intermembrane space",
                "Cytoplasm",
                "Nucleus"
            ],
            answer: 1,
            explanation: [
                "The mitochondrial matrix has a lower H⁺ concentration compared with the intermembrane space at this stage.",
                "Correct! H⁺ accumulates in the intermembrane space because the ETC pumps hydrogen ions out of the matrix.",
                "The cytoplasm is not the location of the mitochondrial proton gradient.",
                "The nucleus is not involved in mitochondrial chemiosmosis."
            ]
        },
        {
            question: "What is the role of oxygen in the electron transport chain and chemiosmosis?",
            options: [
                "It pumps H⁺ ions across the membrane.",
                "It carries electrons to ATP synthesis.",
                "It is the final electron acceptor, allowing the electron transport chain to continue functioning.",
                "It directly catalyzes ATP formation."
            ],
            answer: 2,
            explanation: [
                "The ETC complexes, not oxygen, pump H⁺ across the membrane.",
                "Cytochrome c and other electron carriers transfer electrons through the ETC.",
                "Correct! Oxygen accepts electrons at the end of the ETC, allowing electron transport to continue and water to form.",
                "ATP synthase catalyzes ATP formation."
            ]
        },
        {
            question: "The energy that creates the H⁺ gradient used in chemiosmosis comes directly from:",
            options: [
                "Sunlight",
                "ATP already stored in the cell",
                "High-energy electrons from NADH and FADH₂",
                "Carbon dioxide"
            ],
            answer: 2,
            explanation: [
                "Sunlight is used during photosynthesis, not directly to create the mitochondrial proton gradient.",
                "The gradient is established by proton pumping powered by electron transport, not by ATP already stored in the cell.",
                "Correct! Energy released as high-energy electrons from NADH and FADH₂ move through the ETC powers proton pumping.",
                "Carbon dioxide is a product of earlier stages of cellular respiration."
            ]
        },
        {
            question: "Which enzyme allows H⁺ ions to pass through the inner mitochondrial membrane during chemiosmosis?",
            options: [
                "ATP synthase",
                "Cytochrome c",
                "NADH dehydrogenase",
                "Hexokinase"
            ],
            answer: 0,
            explanation: [
                "Correct! ATP synthase provides a pathway for H⁺ to flow back into the mitochondrial matrix and uses the released energy to produce ATP.",
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

    currentQuestion = 0;

    // Reset only the current quiz score.
    currentQuizScore = 0;

    // Prepare a fresh score for the current module.
    moduleScores[currentModule] = 0;

    document.getElementById("checkpoint-title").textContent =
        lessons[currentModule].title + " Quiz";

    document.getElementById("checkpoint-topic-label").textContent =
        lessons[currentModule].title.toUpperCase();

    showCheckpointQuestion();

    showScreen("checkpoint-screen");
}

// ==========================================
// 16. DISPLAY QUESTION
// ==========================================

function showCheckpointQuestion() {

    const question =
        quizzes[currentModule][currentQuestion];

    document.getElementById("checkpoint-number").textContent =
        `Question ${currentQuestion + 1} of 5`;

    document.getElementById("checkpoint-progress").style.width =
        `${((currentQuestion + 1) / 5) * 100}%`;

    document.getElementById("checkpoint-question").textContent =
        question.question;

    const optionsContainer =
        document.getElementById("checkpoint-options");

    optionsContainer.innerHTML =
        question.options.map((option, index) => `
            <button class="option-btn"
                onclick="answerCheckpoint(${index})">

                <span class="option-letter">
                    ${String.fromCharCode(65 + index)}
                </span>

                <span>${option}</span>

            </button>
        `).join("");

    const feedback =
        document.getElementById("checkpoint-feedback");

    feedback.className = "feedback hidden";
    feedback.textContent = "";

    document.getElementById("checkpoint-next")
        .classList.add("hidden");
}

// ==========================================
// 17. ANSWER CHECKPOINT
// ==========================================

function answerCheckpoint(selectedIndex) {

    const question =
        quizzes[currentModule][currentQuestion];

    const buttons =
        document.querySelectorAll(
            "#checkpoint-options .option-btn"
        );

    // Prevent answering the same question more than once.
    if (buttons.length === 0 || buttons[0].disabled) {
        return;
    }

    const isCorrect =
        selectedIndex === question.answer;

    buttons.forEach((button, index) => {

        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && !isCorrect) {
            button.classList.add("wrong");
        }

    });

    const feedback =
        document.getElementById("checkpoint-feedback");

    if (isCorrect) {

        feedback.className = "feedback good";

        feedback.innerHTML = `
            <strong>✓ Correct Answer!</strong><br>
            ${question.explanation[selectedIndex]}
        `;

        // ==================================
        // IMPORTANT SCORING FIX
        // ADD ONE POINT FOR CORRECT ANSWER
        // ==================================

        currentQuizScore++;

        moduleScores[currentModule] = currentQuizScore;

    } else {

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

    // Show updated score during the quiz.
    const scoreDisplay =
        document.getElementById("live-quiz-score");

    if (scoreDisplay) {
        scoreDisplay.textContent =
            `${currentQuizScore} / 5`;
    }

    document.getElementById("checkpoint-next")
        .classList.remove("hidden");

    document.getElementById("checkpoint-next").textContent =
        currentQuestion === 4
            ? "VIEW MODULE RESULT →"
            : "NEXT QUESTION →";
}

// ==========================================
// 18. NEXT QUESTION
// ==========================================

function nextCheckpointQuestion() {

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

    // Get the actual score from this quiz.
    const score = currentQuizScore;

    // Save this module's score.
    moduleScores[currentModule] = score;

    // Calculate total score from all modules.
    totalScore = moduleScores.reduce(
        (sum, value) => sum + (value ?? 0),
        0
    );

    // Award XP only once per module.
    if (!completedModules[currentModule]) {

        const earnedXP = 20 + (score * 10);

        totalXP += earnedXP;

        completedModules[currentModule] = true;

        document.getElementById("checkpoint-xp-earned").textContent =
            `+${earnedXP} XP`;

    } else {

        document.getElementById("checkpoint-xp-earned").textContent =
            "Module already completed - XP unchanged";
    }

    document.getElementById("checkpoint-score").textContent =
        `${score} / 5`;

    document.getElementById("checkpoint-result-title").textContent =
        score >= 4 ? "Excellent Work!" : "Keep Learning!";

    document.getElementById("checkpoint-result-message").textContent =
        score === 5
            ? "Perfect score! You have mastered this topic."
            : score >= 3
            ? "Good job! Review the explanations to strengthen your understanding."
            : "Keep practicing. Revisit the lesson and learn from the feedback.";

    updateXP();

    updateModuleProgress();

    showScreen("checkpoint-result-screen");
}

// ==========================================
// 20. UPDATE XP
// ==========================================

function updateXP() {

    const xpDisplay =
        document.getElementById("xp-display");

    if (xpDisplay) {
        xpDisplay.textContent = `⚡ ${totalXP} XP`;
    }
}

// ==========================================
// 21. UPDATE MODULE PROGRESS
// ==========================================

function updateModuleProgress() {

    const completed =
        completedModules.filter(Boolean).length;

    const label =
        document.getElementById("module-progress-label");

    const progress =
        document.getElementById("module-progress");

    if (label) {
        label.textContent =
            `${completed} / 4 completed`;
    }

    if (progress) {
        progress.style.width =
            `${(completed / 4) * 100}%`;
    }

    completedModules.forEach((isComplete, index) => {

        const status =
            document.getElementById(`status-${index}`);

        if (status) {
            status.textContent =
                isComplete ? "✓ COMPLETED" : "NOT STARTED";
        }

    });
}

// ==========================================
// 22. CONTINUE TO NEXT MODULE
// ==========================================

function continueAfterCheckpoint() {

    if (currentModule < 3) {

        openModule(currentModule + 1);

    } else {

        showFinalResults();
    }
}

// ==========================================
// 23. FINAL RESULTS
// ==========================================

function showFinalResults() {

    // Recalculate final score before displaying.
    totalScore = moduleScores.reduce(
        (sum, value) => sum + (value ?? 0),
        0
    );

    document.getElementById("final-score").textContent =
        `${totalScore} / 20`;

    document.getElementById("final-xp").textContent =
        totalXP;

    let message = "";

    if (totalScore >= 18) {

        message =
            "Outstanding! You demonstrated excellent understanding of cellular respiration.";

    } else if (totalScore >= 15) {

        message =
            "Great work! You have a strong understanding of the four stages.";

    } else if (totalScore >= 10) {

        message =
            "Good effort! Review the lessons to strengthen the concepts you found challenging.";

    } else {

        message =
            "Your learning journey does not end here. Revisit the modules and keep exploring!";
    }

    document.getElementById("final-message").textContent =
        message;

    showScreen("final-screen");
}

// ==========================================
// 24. RESTART ADVENTURE
// ==========================================

function restartAdventure() {

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

    showScreen("home-screen");
}

// ==========================================
// 25. INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    updateXP();

    updateModuleProgress();

    const finishButton =
        document.getElementById("game-finish-btn");

    if (finishButton) {

        finishButton.disabled = true;

        finishButton.textContent =
            "COMPLETE THE CHALLENGE FIRST";
    }

});
