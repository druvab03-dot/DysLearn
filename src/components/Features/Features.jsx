import "./Features.css";

function Features() {
  const features = [
    {
      title: "AI Handwriting Analysis",
      description:
        "Analyze handwriting samples to understand each child's learning level.",
    },
    {
      title: "Multilingual Learning",
      description:
        "Learn seamlessly in multiple languages through one platform.",
    },
    {
      title: "Parent Dashboard",
      description:
        "Track your child's learning progress and performance.",
    },
    {
      title: "Interactive Learning",
      description:
        "Games, quizzes and engaging lessons designed for young learners.",
    },
  ];

  return (
    <section className="features">

      <h2>Everything Your Child Needs to Learn Better</h2>

      <div className="featureGrid">

        {features.map((feature, index) => (

          <div className="featureCard" key={index}>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;