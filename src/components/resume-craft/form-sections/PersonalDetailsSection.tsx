'use client';

import { useFormContext } from 'react-hook-form';
import type { ResumeData } from '@/lib/resumeTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const PersonalDetailsSection: React.FC = () => {
  const { control } = useFormContext<ResumeData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormField
          control={control}
          name="personalDetails.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormField
          control={control}
          name="personalDetails.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address / Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="personalDetails.summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary / Objective</FormLabel>
            <FormControl>
              <Textarea placeholder="A brief professional summary or career objective..." {...field} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <FormField
          control={control}
          name="personalDetails.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="linkedin.com/in/yourprofile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="github.com/yourusername" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalDetails.portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio/Website URL</FormLabel>
              <FormControl>
                <Input placeholder="yourportfolio.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PersonalDetailsSection;