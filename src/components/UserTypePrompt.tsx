import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Building, User } from 'lucide-react';

const UserTypePrompt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'participant' | 'company'>('participant');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const checkUserType = async () => {
      if (!user) return;

      // Check if user type is already set
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user type:', error);
        return;
      }

      if (!data?.user_type) {
        setIsOpen(true);
      }
    };

    checkUserType();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    if (selectedType === 'company' && !companyName) {
      toast.error('Please enter your company name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_type: selectedType,
          company_name: selectedType === 'company' ? companyName : null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      setIsOpen(false);
      toast.success('Profile updated successfully');

      // Redirect to the appropriate dashboard
      navigate(selectedType === 'company' ? '/app/company' : '/app');
    } catch (error) {
      console.error('Error updating user type:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please select whether you're joining as a participant or a company.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant={selectedType === 'participant' ? 'default' : 'outline'} 
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setSelectedType('participant')}
          >
            <User className="h-8 w-8" />
            <span>Participant</span>
          </Button>
          
          <Button 
            variant={selectedType === 'company' ? 'default' : 'outline'} 
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setSelectedType('company')}
          >
            <Building className="h-8 w-8" />
            <span>Company</span>
          </Button>
        </div>
        
        {selectedType === 'company' && (
          <div className="space-y-2 py-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input 
              id="company-name" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              placeholder="Enter your company name"
            />
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading || (selectedType === 'company' && !companyName)}>
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserTypePrompt; 