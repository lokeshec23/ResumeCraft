import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

const ModernTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={`mb-6 ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-2 pb-1 border-b border-accent/30">{title}</h2>
      {children}
    </section>
  );
  
  const ContactInfoItem: React.FC<{ icon: React.ElementType, text?: string, href?: string, label?: string }> = ({ icon: Icon, text, href, label }) => {
    if (!text) return null;
    const content = <><Icon className="w-4 h-4 mr-2 text-accent" /> {label && <span className="font-medium">{label}: </span>}{text}</>;
    return href ? 
      <a href={href.startsWith('http') || href.startsWith('mailto:') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs mb-1 hover:text-primary transition-colors">{content}</a> : 
      <span className="flex items-center text-xs mb-1">{content}</span>;
  };


  return (
    <div className="p-8 bg-white text-gray-700 font-sans leading-normal shadow-lg" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (Contact & Skills) */}
        <div className="col-span-12 md:col-span-4 bg-background p-6 rounded-md shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-1">{personalDetails.fullName}</h1>
            {/* <p className="text-sm text-gray-600">Optional Tagline / Current Role</p> */}
          </div>
          
          <Section title="Contact">
            <ContactInfoItem icon={Mail} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />
            <ContactInfoItem icon={Phone} text={personalDetails.phoneNumber} />
            <ContactInfoItem icon={MapPin} text={personalDetails.address} />
            <ContactInfoItem icon={Linkedin} text={personalDetails.linkedin} href={personalDetails.linkedin} />
            <ContactInfoItem icon={Github} text={personalDetails.github} href={personalDetails.github} />
            <ContactInfoItem icon={Globe} text={personalDetails.portfolio} href={personalDetails.portfolio} />
          </Section>

          {skills.length > 0 && (
            <Section title="Skills">
              {skills.map((skill) => skill.name && (
                <div key={skill.id} className="mb-1.5">
                  <p className="text-xs font-medium">{skill.name}</p>
                  {skill.category && <p className="text-xs text-gray-500">{skill.category}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right Column (Main Content) */}
        <div className="col-span-12 md:col-span-8 py-2">
          {personalDetails.summary && (
            <Section title="Summary">
              <p className="text-xs">{personalDetails.summary}</p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience">
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <h3 className="text-md font-semibold text-primary">{exp.jobTitle}</h3>
                  <div className="flex justify-between items-baseline text-xs mb-0.5">
                    <p className="italic">{exp.company}</p>
                    <p className="text-gray-500">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-1 text-xs space-y-0.5">
                    {exp.responsibilities.map((resp, idx) => resp && <li key={idx}>{resp}</li>)}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="text-md font-semibold text-primary">{edu.degree}</h3>
                  <p className="italic text-xs">{edu.institution} - {edu.fieldOfStudy}</p>
                  <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  {edu.description && <p className="text-xs mt-1">{edu.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <h3 className="text-md font-semibold text-primary flex items-center">
                    {proj.name}
                    {proj.link && (
                      <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-accent hover:underline">
                        <Globe className="w-3 h-3"/>
                      </a>
                    )}
                  </h3>
                  <p className="text-xs mt-0.5">{proj.description}</p>
                  {proj.technologies.length > 0 && <p className="text-xs mt-1"><strong>Built with:</strong> {proj.technologies.filter(t => t).join(', ')}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
