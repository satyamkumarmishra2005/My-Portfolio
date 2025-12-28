import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero, About, Skills, Achievements, Projects, /* Experience, */ Contact } from "@/components/sections";
import { skillsData } from "@/data/skills";
import { achievementsData } from "@/data/achievements";
import { projectsData } from "@/data/projects";
// import { experienceData } from "@/data/experience";
import { heroContent, aboutContent, contactContent } from "@/data/content";

/**
 * Home Page Component
 * Composes all sections with lazy loading for 3D components
 * Requirements: 9.1
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" role="main">
        <Hero
          name={heroContent.name}
          title={heroContent.title}
          tagline={heroContent.tagline}
        />
        <About
          heading={aboutContent.heading}
          paragraphs={aboutContent.paragraphs}
        />
        <Skills categories={skillsData} />
        <Achievements achievements={achievementsData} />
        <Projects projects={projectsData} />
        {/* <Experience experiences={experienceData} /> */}
        <Contact
          heading={contactContent.heading}
          description={contactContent.description}
          email={contactContent.email}
          github={contactContent.github}
          linkedin={contactContent.linkedin}
        />
      </main>
      <Footer />
    </>
  );
}
