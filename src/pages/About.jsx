import SEO from "../components/seo/SEO";

function About() {
  return (
    <>
      <SEO
        title="Biz haqimizda"
        description="Darslik Platforma - O'zbekistondagi eng yaxshi online ta'lim platformasi. Bizning maqsadimiz bilim berish."
        url="/about"
      />

      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <h1 className="gradient-text">Biz haqimizda</h1>
      </div>
    </>
  );
}
export default About;
