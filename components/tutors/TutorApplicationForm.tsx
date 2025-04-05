
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

// Updated form validation schema with all fields required
const tutorApplicationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  subjects: z.string().min(1, { message: "Subjects are required" }),
  class: z.string().min(1, { message: "Class is required" }),
  medium: z.string().min(1, { message: "Medium is required" }),
  board: z.string().min(1, { message: "Board is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  pinCode: z.string().min(6, { message: "Valid PIN code is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  feeRange: z.string().min(1, { message: "Fee range is required" }),
});

type TutorApplicationFormValues = z.infer<typeof tutorApplicationSchema>;

interface TutorApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TutorApplicationForm: React.FC<TutorApplicationFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthState();
  
  const form = useForm<TutorApplicationFormValues>({
    resolver: zodResolver(tutorApplicationSchema),
    defaultValues: {
      name: user?.name || "",
      subjects: "",
      class: "",
      medium: "",
      board: "",
      location: "",
      pinCode: "",
      address: "",
      feeRange: ""
    }
  });

  const handleSubmit = async (values: TutorApplicationFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to complete your tutor profile",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create tutor application data
      const tutorData = {
        id: `app-${Date.now()}`,
        tutor: {
          id: user.id,
          name: values.name,
          image: user.profileImage || "https://randomuser.me/api/portraits/lego/1.jpg",
          subjects: values.subjects.split(',').map(subject => subject.trim()),
          bio: `${values.medium} medium, ${values.board} board teacher`,
          rating: 0,
          hourlyRate: parseInt(values.feeRange.split('-')[0]) || 20,
          availability: ["Weekdays", "Weekends"],
          class: values.class,
          location: values.location,
          pinCode: values.pinCode,
          address: values.address,
          feeRange: values.feeRange
        },
        status: 'pending',
        date: new Date().toLocaleDateString(),
        message: `I would like to complete my tutor profile. Location: ${values.location}, PIN: ${values.pinCode}, Class: ${values.class}, Medium: ${values.medium}, Board: ${values.board}, Fee range: ${values.feeRange}`,
      };
      
      onSubmit(tutorData);
      
      toast({
        title: "Profile Completed",
        description: "Your tutor profile has been updated successfully",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting tutor profile:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Tutor Profile</DialogTitle>
          <DialogDescription>
            Fill out these details to complete your tutor profile.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics, Physics, Chemistry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">Class 1-5</SelectItem>
                        <SelectItem value="6-8">Class 6-8</SelectItem>
                        <SelectItem value="9-10">Class 9-10</SelectItem>
                        <SelectItem value="11-12">Class 11-12</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Bilingual">Bilingual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="board"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="State Board">State Board</SelectItem>
                        <SelectItem value="IB">IB</SelectItem>
                        <SelectItem value="University">University</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (City)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input placeholder="6-digit PIN code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Your full address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="feeRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Range (₹ per hour)</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200-300">₹200-300</SelectItem>
                        <SelectItem value="300-500">₹300-500</SelectItem>
                        <SelectItem value="500-800">₹500-800</SelectItem>
                        <SelectItem value="800-1200">₹800-1200</SelectItem>
                        <SelectItem value="1200+">₹1200+</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Complete Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TutorApplicationForm;
