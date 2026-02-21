import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ProfileService,
  type Profile,
  type ProfileUser,
} from '@/services/profile.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Save, User, Mail, Phone, MapPin, Car } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  license_number: z.string().min(1, 'License number is required'),
  address: z.string().min(1, 'Address is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const [profile, setProfile] = useState<{
    user: ProfileUser;
    profile: Profile;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await ProfileService.getProfile();
        setProfile(data);
        reset({
          full_name: data.profile.full_name,
          phone: data.user.phone || '',
          license_number: data.profile.license_number || '',
          address: data.profile.address || '',
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const updatedProfile = await ProfileService.updateProfile(data);
      setProfile(updatedProfile);
      reset({
        full_name: updatedProfile.profile.full_name,
        phone: updatedProfile.user.phone || '',
        license_number: updatedProfile.profile.license_number || '',
        address: updatedProfile.profile.address || '',
      });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <p className='text-muted-foreground'>Profile not found</p>
      </div>
    );
  }

  return (
    <div className='px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-8'>
          <h1 className='text-foreground text-3xl font-bold'>My Profile</h1>
          <p className='text-muted-foreground mt-2'>
            Manage your personal information
          </p>
        </div>

        <div className='grid gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Account Information
              </CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label className='text-muted-foreground flex items-center gap-2'>
                    <Mail className='h-4 w-4' /> Email
                  </Label>
                  <Input
                    value={profile.user.email}
                    disabled
                    className='bg-muted'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-muted-foreground flex items-center gap-2'>
                    <User className='h-4 w-4' /> Username
                  </Label>
                  <Input
                    value={profile.user.username}
                    disabled
                    className='bg-muted'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-muted-foreground flex items-center gap-2'>
                    <Car className='h-4 w-4' /> Role
                  </Label>
                  <Input
                    value={profile.user.role}
                    disabled
                    className='bg-muted'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-muted-foreground'>
                    Wallet Balance
                  </Label>
                  <Input
                    value={`$${profile.profile.wallet_balance}`}
                    disabled
                    className='bg-muted'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='full_name'>Full Name</Label>
                    <Input id='full_name' {...register('full_name')} />
                    {errors.full_name && (
                      <p className='text-sm text-red-500'>
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone' className='flex items-center gap-2'>
                      <Phone className='h-4 w-4' /> Phone
                    </Label>
                    <Input id='phone' {...register('phone')} />
                    {errors.phone && (
                      <p className='text-sm text-red-500'>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='license_number'
                      className='flex items-center gap-2'
                    >
                      <Car className='h-4 w-4' /> License Number
                    </Label>
                    <Input
                      id='license_number'
                      {...register('license_number')}
                    />
                    {errors.license_number && (
                      <p className='text-sm text-red-500'>
                        {errors.license_number.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='address'
                      className='flex items-center gap-2'
                    >
                      <MapPin className='h-4 w-4' /> Address
                    </Label>
                    <Input id='address' {...register('address')} />
                    {errors.address && (
                      <p className='text-sm text-red-500'>
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex justify-end pt-4'>
                  <Button type='submit' disabled={!isDirty || isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
