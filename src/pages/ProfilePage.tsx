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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, User, Mail, Phone, MapPin, Car, History } from 'lucide-react';
import { toast } from 'sonner';
import { BookingHistory } from '@/components/BookingHistory';

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
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-foreground text-4xl font-extrabold tracking-tight'>My Account</h1>
          <p className='text-muted-foreground mt-2 text-lg'>
            Manage your personal profile and view your rental history
          </p>
        </div>

        <Tabs defaultValue='profile' className='space-y-8'>
          <div className='flex justify-center'>
            <TabsList className='grid w-full max-w-[400px] grid-cols-2'>
              <TabsTrigger value='profile' className='flex items-center gap-2'>
                <User className='h-4 w-4' /> Profile
              </TabsTrigger>
              <TabsTrigger value='bookings' className='flex items-center gap-2'>
                <History className='h-4 w-4' /> Bookings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='profile' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-1'>
              <Card className='shadow-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-xl'>
                    <User className='text-primary h-5 w-5' />
                    Account Information
                  </CardTitle>
                  <CardDescription>Your basic account details and status</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label className='text-muted-foreground flex items-center gap-2 font-medium'>
                        <Mail className='h-4 w-4' /> Email
                      </Label>
                      <Input
                        value={profile.user.email}
                        disabled
                        className='bg-muted font-medium'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-muted-foreground flex items-center gap-2 font-medium'>
                        <User className='h-4 w-4' /> Username
                      </Label>
                      <Input
                        value={profile.user.username}
                        disabled
                        className='bg-muted font-medium'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-muted-foreground flex items-center gap-2 font-medium'>
                        <Car className='h-4 w-4' /> Role
                      </Label>
                      <Input
                        value={profile.user.role}
                        disabled
                        className='bg-muted font-medium'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-muted-foreground font-medium'>
                        Wallet Balance
                      </Label>
                      <div className='bg-primary/5 text-primary rounded-md border border-primary/20 px-3 py-2 text-lg font-bold'>
                        ${profile.profile.wallet_balance}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='shadow-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-xl'>
                    <Save className='text-primary h-5 w-5' />
                    Personal Details
                  </CardTitle>
                  <CardDescription>Update your contact and identification details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='full_name' className='font-medium'>Full Name</Label>
                        <Input
                          id='full_name'
                          {...register('full_name')}
                          placeholder='Enter your full name'
                        />
                        {errors.full_name && (
                          <p className='text-sm text-destructive'>
                            {errors.full_name.message}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='phone' className='flex items-center gap-2 font-medium'>
                          <Phone className='h-4 w-4' /> Phone Number
                        </Label>
                        <Input
                          id='phone'
                          {...register('phone')}
                          placeholder='Enter your phone number'
                        />
                        {errors.phone && (
                          <p className='text-sm text-destructive'>
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='license_number'
                          className='flex items-center gap-2 font-medium'
                        >
                          <Car className='h-4 w-4' /> Driving License
                        </Label>
                        <Input
                          id='license_number'
                          {...register('license_number')}
                          placeholder='Enter license number'
                        />
                        {errors.license_number && (
                          <p className='text-sm text-destructive'>
                            {errors.license_number.message}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='address'
                          className='flex items-center gap-2 font-medium'
                        >
                          <MapPin className='h-4 w-4' /> Home Address
                        </Label>
                        <Input
                          id='address'
                          {...register('address')}
                          placeholder='Enter your physical address'
                        />
                        {errors.address && (
                          <p className='text-sm text-destructive'>
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='flex justify-end border-t pt-6'>
                      <Button
                        type='submit'
                        size='lg'
                        disabled={!isDirty || isSaving}
                        className='bg-primary px-8 font-semibold transition-all hover:scale-[1.02]'
                      >
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
          </TabsContent>

          <TabsContent value='bookings' className='space-y-6'>
            <div className='mb-4'>
              <h2 className='text-2xl font-bold'>Booking History</h2>
              <p className='text-muted-foreground'>Track all your car rental reservations</p>
            </div>
            <BookingHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
