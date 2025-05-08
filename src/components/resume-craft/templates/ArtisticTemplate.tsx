
import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, Feather, Briefcase, BookOpen, Palette, Code } from 'lucide-react';

const ArtisticTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const Section: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className = '' }) => (
    <section className={`mb-6 ${className}`}>
      <div className="flex items-center mb-3">
        {Icon && <Icon className="w-6 h-6 mr-3 text-primary/70" />}
        <h2 className="text-xl font-bold text-primary tracking-tight" style={{ fontFamily: "'Caveat', cursive" }}>{title}</h2>
      </div>
      {children}
    </section>
  );

  const ContactLink: React.FC<{ href?: string, text?: string, icon: React.ElementType }> = ({ href, text, icon: Icon }) => {
    if (!text) return null;
    const linkContent = href ? text.replace(/^https?:\/\/(www\.)?/, '') : text;
    const display = (
        <>
            <Icon className="w-4 h-4 mr-2 text-primary/60" />
            <span>{linkContent}</span>
        </>
    );
    return href ? (
        <a href={href.startsWith('mailto:') ? href : (href.startsWith('http') ? href : `https://${href}`)} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-foreground/80 hover:text-accent transition-colors">
            {display}
        </a>
    ) : <div className="flex items-center text-xs text-foreground/80">{display}</div>;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-background to-muted/30 text-card-foreground font-sans text-sm leading-relaxed shadow-xl print:bg-white print:text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header with background pattern */}
      <header className="relative text-center mb-10 p-6 rounded-lg overflow-hidden bg-primary/5">
         {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent/50 rounded-tl-lg"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/50 rounded-br-lg"></div>
        
        <h1 className="text-4xl font-extrabold text-primary mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>{personalDetails.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1.5 mt-3">
          {personalDetails.email && <ContactLink href={`mailto:${personalDetails.email}`} text={personalDetails.email} icon={Mail} />}
          {personalDetails.phoneNumber && <ContactLink text={personalDetails.phoneNumber} icon={Phone} />}
          {personalDetails.address && <ContactLink text={personalDetails.address} icon={MapPin} />}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1.5 mt-1.5">
          {personalDetails.linkedin && <ContactLink href={personalDetails.linkedin} text="LinkedIn" icon={Linkedin} />}
          {personalDetails.github && <ContactLink href={personalDetails.github} text="GitHub" icon={Github} />}
          {personalDetails.portfolio && <ContactLink href={personalDetails.portfolio} text="Portfolio" icon={Globe} />}
        </div>
      </header>

      {/* Summary */}
      {personalDetails.summary && (
        <Section title="My Story" icon={Feather}>
          <p className="text-xs text-foreground/80 italic leading-relaxed whitespace-pre-line">{personalDetails.summary}</p>
        </Section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column for Experience */}
        <div className="md:col-span-2">
          {experience.length > 0 && (
            <Section title="My Journey" icon={Briefcase}>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-5 relative pl-6 before:absolute before:left-2 before:top-1.5 before:w-px before:h-full before:bg-accent/30 last:before:h-[calc(100%-1rem)]">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-accent rounded-full border-2 border-card"></div>
                  <h3 className="text-md font-semibold text-primary">{exp.jobTitle} at <span className="italic text-primary/80">{exp.company}</span></h3>
                  <p className="text-xs text-muted-foreground mb-1">{exp.startDate} - {exp.endDate}</p>
                  <ul className="list-none mt-1 text-xs space-y-1 text-foreground/75">
                    {exp.responsibilities.map((resp, idx) => resp && <li key={idx} className="flex items-start"><span className="mr-2 text-accent">&ndash;</span>{resp}</li>)}
                  </ul>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right column for Education and Skills */}
        <div className="md:col-span-1">
          {education.length > 0 && (
            <Section title="Foundations" icon={BookOpen}>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4 p-3 bg-card/50 rounded-md shadow-sm">
                  <h3 className="text-sm font-semibold text-primary">{edu.degree}</h3>
                  <p className="text-xs italic text-foreground/70">{edu.institution}</p>
                  {edu.fieldOfStudy && <p className="text-xs text-muted-foreground">{edu.fieldOfStudy}</p>}
                  <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                  {edu.description && <p className="text-xxs mt-1 text-foreground/75 leading-snug">{edu.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="My Palette" icon={Palette}>
              <div className="flex flex-wrap gap-2 text-xs">
                {skills.map((skill) => skill.name && (
                  <span key={skill.id} className="bg-accent/10 text-accent-foreground px-3 py-1.5 rounded-full shadow-sm transform hover:scale-105 transition-transform">
                    {skill.name}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Projects - Full Width */}
      {projects.length > 0 && (
        <Section title="Creations" icon={Code} className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-card/60 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-md font-semibold text-primary">{proj.name}</h3>
                    {proj.link && (
                    <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center">
                        <Globe className="w-3 h-3 mr-1" /> View
                    </a>
                    )}
                </div>
                <p className="text-xs text-foreground/75 mb-2">{proj.description}</p>
                {proj.technologies.length > 0 && <p className="text-xxs"><strong className="text-foreground/80">Crafted with:</strong> {proj.technologies.filter(t => t).join(', ')}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default ArtisticTemplate;
