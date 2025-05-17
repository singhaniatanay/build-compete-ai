import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SelectUserType = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'participant' | 'company'>('participant');
  const [companyName, setCompanyName] = useState('');

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
        .update({
          user_type: selectedType,
          company_name: selectedType === 'company' ? companyName : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');

      // Redirect to the appropriate dashboard
      navigate(selectedType === 'company' ? '/app/company' : '/app', { replace: true });
    } catch (error) {
      console.error('Error updating user type:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please select whether you're joining as a participant or a company.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                placeholder="Enter your company name"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSave} 
            disabled={loading || (selectedType === 'company' && !companyName)}
          >
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SelectUserType; 