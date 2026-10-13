import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function AssessmentLobby() {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState(1);
    const [selectedSubject, setSelectedSubject] = useState("english");
    const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

    const subjects = [
        {
            key: "english",
            name: "English",
            icon: "🔤",
            desc: "Letter recognition, word building, vocabulary & comprehension.",
        },
        {
            key: "mathematics",
            name: "Mathematics",
            icon: "🔢",
            desc: "Numbers, geometry, skip counting & arithmetic reasoning.",
        },
        {
            key: "evs",
            name: "EVS (with GK)",
            icon: "🌿",
            desc: "Nature, senses, living things, environments & general knowledge.",
        },
        {
            key: "hindi",
            name: "Hindi",
            icon: "🇮🇳",
            desc: "वर्णमाला, शब्द निर्माण, लिंग भेद और व्याकरणिक समझ।",
        },
        {
            key: "kannada",
            name: "Kannada",
            icon: "ಕ",
            desc: "ಸ್ವರಗಳು, ವ್ಯಂಜನಗಳು, ಪದ ಜೋಡಣೆ ಮತ್ತು ಪಠ್ಯಪುಸ್ತಕ ಪರಿಕಲ್ಪನೆಗಳು.",
        },
    ];

    const gameMechanics = [
        {
            icon: "🔍",
            title: "Picture Detective",
            desc: "Visual discrimination and target spotting among real photographic assets.",
        },
        {
            icon: "🔗",
            title: "Match the Following",
            desc: "Connecting large verified pictures with their curriculum definitions and words.",
        },
        {
            icon: "🔤",
            title: "Sequence Builder",
            desc: "Drag-or-tap arrangement of letters, numbers, and conceptual steps.",
        },
        {
            icon: "🧠",
            title: "Memory & Recall",
            desc: "Gentle card-matching challenge strengthening visual working memory.",
        },
        {
            icon: "🧩",
            title: "Odd-One-Out",
            desc: "Categorical discrimination identifying items that do not belong.",
        },
        {
            icon: "📖",
            title: "Theoretical Knowledge",
            desc: "Curriculum multiple-choice assessment of core textbook understanding.",
        },
    ];

    const handleLaunch = () => {
        navigate(
            `/class/${selectedClass}/${selectedSubject}/assessment`
        );
    };

    return (
        <div className="assessmentLobbyPage">
            <Header />

            <main className="lobbyMainContainer">
                {/* Hero Banner */}
                <section className="lobbyHeroSection">
                    <span className="lobbyEyebrow">EVALUATE & REINFORCE SKILLS</span>
                    <h1 className="lobbyTitle">Gamified Multimodal Assessment</h1>
                    <p className="lobbySubtitle">
                        A low-stress, 30-minute curriculum assessment combining 5 interactive
                        educational games with a theoretical knowledge challenge.
                    </p>
                </section>

                {/* Configuration Card */}
                <section className="lobbyConfigCard">
                    {/* Class Selector */}
                    <div className="configGroup">
                        <label className="configLabel">1. Choose Class Level:</label>
                        <div className="classPillsRow">
                            {[1, 2, 3, 4, 5].map((cls) => (
                                <button
                                    key={cls}
                                    type="button"
                                    className={`classPill ${
                                        selectedClass === cls ? "classPillActive" : ""
                                    }`}
                                    onClick={() => setSelectedClass(cls)}
                                >
                                    Class {cls}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject Selector */}
                    <div className="configGroup">
                        <label className="configLabel">2. Select Subject:</label>
                        <div className="subjectCardsGrid">
                            {subjects.map((sub) => (
                                <button
                                    key={sub.key}
                                    type="button"
                                    className={`lobbySubjectCard ${
                                        selectedSubject === sub.key ? "subjectActive" : ""
                                    }`}
                                    onClick={() => setSelectedSubject(sub.key)}
                                >
                                    <span className="lobbySubjectIcon">{sub.icon}</span>
                                    <strong className="lobbySubjectName">{sub.name}</strong>
                                    <p className="lobbySubjectDesc">{sub.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Selector */}
                    <div className="configGroup">
                        <label className="configLabel">3. Challenge Level:</label>
                        <div className="difficultyButtonsRow">
                            {[
                                { key: "easy", icon: "🌱", label: "Easy (Gentle Recognition)" },
                                { key: "medium", icon: "🚀", label: "Medium (Standard Curriculum)" },
                                { key: "hard", icon: "👑", label: "Hard (Advanced Application)" },
                            ].map((d) => (
                                <button
                                    key={d.key}
                                    type="button"
                                    className={`diffBtn diff-${d.key} ${
                                        selectedDifficulty === d.key ? "diffBtnActive" : ""
                                    }`}
                                    onClick={() => setSelectedDifficulty(d.key)}
                                >
                                    <span className="diffIcon">{d.icon}</span>
                                    <span className="diffTitle">{d.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Launch Action Button */}
                    <div className="lobbyLaunchArea">
                        <button
                            type="button"
                            className="startAssessmentBtn launchAssessmentLargeBtn"
                            onClick={handleLaunch}
                        >
                            🚀 Launch Class {selectedClass} {selectedSubject.toUpperCase()} Assessment
                        </button>
                        <span className="lobbyDurationHint">
                            ⏱️ Maximum 30 Minutes • Single Master Timer • Dyslexia Accessible
                        </span>
                    </div>
                </section>

                {/* Game Mechanics Showcase */}
                <section className="lobbyShowcaseSection">
                    <h2 className="showcaseTitle">Included Educational Game Mechanics</h2>
                    <div className="showcaseGrid">
                        {gameMechanics.map((gm, idx) => (
                            <div key={idx} className="showcaseCard">
                                <span className="showcaseIcon">{gm.icon}</span>
                                <h4>{gm.title}</h4>
                                <p>{gm.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default AssessmentLobby;
