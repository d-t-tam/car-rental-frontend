import { Button } from '@/components/ui/button';
import { CarFrontIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container mx-auto flex h-14 items-center'>
        <div className='mr-4 hidden md:flex'>
          <Link
            to='/'
            className='text-primary mr-6 flex items-center space-x-2'
          >
            <CarFrontIcon />
            <span className='hidden font-bold sm:inline-block'>Car Rental</span>
          </Link>
          <nav className='flex items-center space-x-6 text-sm font-medium'>
            <Link
              to='/cars'
              className='hover:text-foreground/80 text-foreground/60 transition-colors'
            >
              Cars
            </Link>
            <Link
              to='/about'
              className='hover:text-foreground/80 text-foreground/60 transition-colors'
            >
              About
            </Link>
            <Link
              to='/contact'
              className='hover:text-foreground/80 text-foreground/60 transition-colors'
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            {/* Search component can go here */}
          </div>
          <nav className='flex items-center space-x-2'>
            <Button variant='ghost' asChild>
              <Link to='/login'>Login</Link>
            </Button>
            <Button asChild>
              <Link to='/register'>Register</Link>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
