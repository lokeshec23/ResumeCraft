
import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, Edit2, Briefcase, GraduationCap, Lightbulb, Star } from 'lucide-react';

const ElegantTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const SectionTitle: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
    <div className="flex items-center mb-4 mt-6">
      {Icon && <Icon className="w-5 h-5 mr-3 text-primary/70" />}
      <h2 className="text-lg font-semibold text-primary tracking-wider" style={{ fontFamily: "'Merriweather', serif" }}>{title}</h2>
    </div>
  );

  const ContactItem: React.FC<{ icon: React.ElementType, text?: string, href?: string, label?: string }> = ({ icon: Icon, text, href, label }) => {
    if (!text) return null;
    const content = (
      <>
        <Icon className="w-3.5 h-3.5 mr-2 text-primary/60 shrink-0" />
        <span className="truncate">{text}</span>
      </>
    );
    return href ? (
      <a href={href.startsWith('http') || href.startsWith('mailto:') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-foreground/70 hover:text-accent transition-colors py-1">
        {content}
      </a>
    ) : (
      <span className="flex items-center text-xs text-foreground/70 py-1">{content}</span>
    );
  };

  return (
    <div className="p-8 bg-card text-card-foreground font-serif text-sm leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
      {/* Header */}
      <header className="text-center mb-8 border-b-2 border-primary/20 pb-6">
        <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{personalDetails.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-1 mt-3 text-xs">
          {personalDetails.email && <ContactItem icon={Mail} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />}
          {personalDetails.phoneNumber && <ContactItem icon={Phone} text={personalDetails.phoneNumber} />}
          {personalDetails.address && <ContactItem icon={MapPin} text={personalDetails.address} />}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-1 mt-1 text-xs">
          {personalDetails.linkedin && <ContactItem icon={Linkedin} text="LinkedIn" href={personalDetails.linkedin} />}
          {personalDetails.github && <ContactItem icon={Github} text="GitHub" href={personalDetails.github} />}
          {personalDetails.portfolio && <ContactItem icon={Globe} text="Portfolio" href={personalDetails.portfolio} />}
        </div>
      </header>

      {/* Summary */}
      {personalDetails.summary && (
        <section className="mb-6">
          <SectionTitle title="Professional Summary" icon={Edit2}/>
          <p className="text-xs text-foreground/80 whitespace-pre-line">{personalDetails.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Work Experience" icon={Briefcase} />
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <h3 className="text-md font-semibold text-primary">{exp.jobTitle}</h3>
              <div className="flex justify-between items-baseline text-xs text-muted-foreground mb-1">
                <p className="font-medium">{exp.company}</p>
                <p>{exp.startDate} - {exp.endDate}</p>
              </div>
              <ul className="list-none pl-1 mt-1 space-y-1 text-xs text-foreground/75">
                {exp.responsibilities.map((resp, idx) => resp && (
                  <li key={idx} className="relative pl-4">
                    <span className="absolute left-0 top-1.5 h-1.5 w-1.5 bg-primary/50 rounded-full"></span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Education" icon={GraduationCap}/>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="text-md font-semibold text-primary">{edu.degree}</h3>
              <p className="text-xs italic text-foreground/70">{edu.institution}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}</p>
              <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
              {edu.description && <p className="text-xs mt-1 text-foreground/75">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Projects" icon={Lightbulb}/>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
               <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-primary">{proj.name}</h3>
                {proj.link && (
                  <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center">
                    <Globe className="w-3 h-3 mr-1" /> View Project
                  </a>
                )}
              </div>
              <p className="text-xs mt-1 text-foreground/75">{proj.description}</p>
              {proj.technologies.length > 0 && <p className="text-xs mt-1.5"><strong className="text-foreground/80">Technologies:</strong> {proj.technologies.filter(t => t).join(', ')}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <SectionTitle title="Skills" icon={Star}/>
          <div className="flex flex-wrap gap-2 text-xs">
            {skills.map((skill) => skill.name && (
              <span key={skill.id} className="bg-primary/5 text-primary/90 px-3 py-1.5 rounded-sm font-medium">
                {skill.name}
                {skill.category && <span className="text-primary/70 ml-1 text-xs">({skill.category})</span>}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ElegantTemplate;
