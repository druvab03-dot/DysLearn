import "./Hero.css";

function Hero({ onStart }) {

    return(

        <section className="hero">

            <h1>
                Empowering Every Child
                <br />
                To Learn Without Limits
            </h1>

            <p>
                AI-powered learning platform designed to make education
                interactive, multilingual, and accessible for every child.
            </p>

            <button
                className="heroButton"
                onClick={onStart}
            >
                Start Learning
            </button>

        </section>

    );

}

export default Hero;