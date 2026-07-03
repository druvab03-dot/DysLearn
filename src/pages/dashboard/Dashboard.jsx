import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2 className="logo">
          DysLearn
        </h2>

        <ul>
          <li>🏠 Home</li>
          <li>📝 Tests</li>
          <li>🎮 Games</li>
          <li>👨‍👩‍👧 Parent Dashboard</li>
        </ul>

      </div>

      {/* MAIN CONTENT */}

      <div className="mainContent">

        {/* HEADER */}

        <div className="header">

          <h1>
            Choose Your Language
          </h1>

          <div className="profile">
            <div className="profileCircle">
              D
            </div>

            <span>
              Druva
            </span>
          </div>

        </div>

        {/* LANGUAGE CARDS */}

        <div className="languageCards">

          <div className="langCard english">
            <h1>Aa</h1>
            <p>English</p>
          </div>

          <div className="langCard kannada">
            <h1>ಅ</h1>
            <p>Kannada</p>
          </div>

          <div className="langCard hindi">
            <h1>अ</h1>
            <p>Hindi</p>
          </div>

        </div>

        {/* GAME SECTION */}

        <div className="gameCard">

          <h2>
            Ready to Learn with Fun?
          </h2>

          <p>
            Play interactive games and improve
            learning skills.
          </p>

          <button>
            Start Playing
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;