import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./FeministHistory.css"; // Optional custom styles

const feministEvents = [
  {
    id: 1,
    title: "Women's Suffrage Movement",
    year: "1848-1920",
    description:
      "A decades-long fight for women’s right to vote, culminating in the 19th Amendment in the US. The women’s suffrage movement was a decades-long fight to win the right to vote for women in the United States. It took activists and reformers nearly 100 years to win that right, and the campaign was not easy: Disagreements over strategy threatened to cripple the movement more than once. But on August 18, 1920, the 19th Amendment to the Constitution was finally ratified, enfranchising all American women and declaring for the first time that they, like men, deserve all the rights and responsibilities of citizenship.  ",
    image: "/women-suffrage.avif",
  },
  {
    id: 2,
    title: "Second-Wave Feminism",
    year: "1960s-1980s",
    description:
      "Focused on workplace equality, reproductive rights, and dismantling gender stereotypes. Second-wave feminism was a period of feminist activity that began in the early 1960s and lasted roughly two decades. Unlike the first wave of feminism, which focused primarily on securing women’s right to vote, the second wave lobbied for equality in all aspects of women’s experience, including employment, politics, marriage, family, education, and sexuality. It addressed issues such as domestic violence, reproductive rights, female sexuality, and pay equality. However, the movement splintered after criticism that it had focused on white women to the exclusion of everyone else",
    image: "/Secondwave.jpg",
  },
 
  {
    id: 4,
    title: "MeToo Movement",
    year: "2017-Present",
    description:
      "A global movement raising awareness about sexual harassment and assault. The #MeToo movement is a social movement and awareness campaign against sexual abuse, sexual harassment, and rape culture. It began in 2006 when sexual assault survivor and activist Tarana Burke used the phrase Me Too on social media to encourage people to share their experiences of sexual abuse or harassment. The movement gained prominence in 2017 in response to news reports of sexual abuse by American film producer Harvey Weinstein. Its goal is to support survivors of sexual violence and promote healing ",
    image: "/metoo.jpg",
  },
];

const FeministHistory = () => {
  return (
    <div className="container">

      {/* Hero Section */}
      <header className="text-center py-5 bg-primary text-white rounded">
        <h2 className="fw-bold">Feminist History</h2>
        <p className="lead">Learn about key moments in the fight for women's rights.</p>
      </header>

      {/* History Grid */}
      <div className="row mt-4">
        {feministEvents.map((event) => (
          <div key={event.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={event.image} className="card-img-top" alt={event.title} />
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="text-muted"><strong>{event.year}</strong></p>
                <p className="card-text">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeministHistory;
