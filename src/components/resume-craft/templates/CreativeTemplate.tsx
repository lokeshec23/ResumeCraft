
import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, Briefcase, GraduationCap, Lightbulb, Wrench, UserCircle, Sparkles } from 'lucide-react';

const CreativeTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const SectionTitle: React.FC<{ title: string; icon?: React.ElementType, className?: string }> = ({ title, icon: Icon, className }) => (
    <div className={`flex items-center mb-3 ${className}`}>
      {Icon && <Icon className="w-5 h-5 mr-2 text-accent" />}
      <h2 className="text-lg font-semibold text-primary tracking-wide">{title.toUpperCase()}</h2>
    </div>
  );

  const ContactIcon: React.FC<{ icon: React.ElementType, text?: string, href?: string, label?: string }> = ({ icon: Icon, text, href, label }) => {
    if (!text) return null;
    const content = (
      <>
        <Icon className="w-3.5 h-3.5 mr-1.5 text-primary shrink-0" />
        {label && <span className="font-medium mr-1">{label}:</span>}
        <span className="truncate" title={text}>{text}</span>
      </>
    );
    return href ? (
      <a href={href.startsWith('http') || href.startsWith('mailto:') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-foreground/80 hover:text-accent transition-colors py-0.5">
        {content}
      </a>
    ) : (
      <span className="flex items-center text-xs text-foreground/80 py-0.5">{content}</span>
    );
  };

  return (
    <div className="p-6 bg-card text-card-foreground font-sans text-sm leading-relaxed shadow-lg print:bg-white print:text-gray-800" style={{ fontFamily: "'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <header className="text-center mb-8 border-b-2 border-accent pb-6">
        <h1 className="text-4xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>{personalDetails.fullName}</h1>
        {personalDetails.summary && <p className="text-sm text-muted-foreground mt-2 italic max-w-2xl mx-auto">{personalDetails.summary.substring(0, personalDetails.summary.indexOf('.') + 1 || 100) + "..."}</p>}
      </header>

      <div className="grid grid-cols-12 gap-x-8">
        {/* Left Column */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <section>
            <SectionTitle title="Contact" icon={UserCircle} />
            <div className="space-y-1 text-xs">
              <ContactIcon icon={Mail} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />
              <ContactIcon icon={Phone} text={personalDetails.phoneNumber} />
              <ContactIcon icon={MapPin} text={personalDetails.address} />
              <ContactIcon icon={Linkedin} text={personalDetails.linkedin} href={personalDetails.linkedin} />
              <ContactIcon icon={Github} text={personalDetails.github} href={personalDetails.github} />
              <ContactIcon icon={Globe} text={personalDetails.portfolio} href={personalDetails.portfolio} />
            </div>
          </section>

          {education.length > 0 && (
            <section>
              <SectionTitle title="Education" icon={GraduationCap} />
              {education.map((edu) => (
                <div key={edu.id} className="mb-3 text-xs">
                  <h3 className="font-semibold text-primary">{edu.degree}</h3>
                  <p className="italic text-foreground/90">{edu.institution}</p>
                  {edu.fieldOfStudy && <p className="text-muted-foreground">{edu.fieldOfStudy}</p>}
                  <p className="text-muted-foreground/80 text-xs">{edu.startDate} - {edu.endDate}</p>
                  {edu.description && <p className="mt-0.5 text-foreground/80">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionTitle title="Skills" icon={Wrench} />
              <div className="flex flex-wrap gap-1.5 text-xs">
                {skills.map((skill) => skill.name && (
                  <span key={skill.id} className="bg-accent/10 text-accent-foreground px-2.5 py-1 rounded-full font-medium">
                    {skill.name}
                    {skill.category && <span className="text-accent/80 ml-1 text-xs">({skill.category})</span>}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          {personalDetails.summary && (
             <section>
                <SectionTitle title="About Me" icon={Sparkles} />
                <p className="text-xs whitespace-pre-line text-foreground/90">{personalDetails.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionTitle title="Experience" icon={Briefcase} />
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <h3 className="text-md font-semibold text-primary">{exp.jobTitle}</h3>
                  <div className="flex justify-between items-baseline text-xs text-muted-foreground mb-0.5">
                    <p className="font-medium italic">{exp.company}</p>
                    <p>{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-1 text-xs space-y-0.5 text-foreground/80">
                    {exp.responsibilities.map((resp, idx) => resp && <li key={idx}>{resp}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionTitle title="Projects" icon={Lightbulb} />
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-primary">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center">
                        <Globe className="w-3 h-3 mr-1" /> Link
                      </a>
                    )}
                  </div>
                  <p className="text-xs mt-0.5 text-foreground/80">{proj.description}</p>
                  {proj.technologies.length > 0 && <p className="text-xs mt-1"><strong className="text-foreground/90">Built with:</strong> {proj.technologies.filter(t => t).join(', ')}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
