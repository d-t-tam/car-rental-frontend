
export function Footer() {
  return (
    <footer className='bg-background border-t'>
      <div className='container mx-auto flex flex-col items-center justify-between gap-4 py-8 md:h-28 md:flex-row md:py-0'>
        <div className='flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
          <p className='text-muted-foreground text-center text-sm leading-loose md:text-left'>
            Built by{' '}
            <a
              href='#'
              target='_blank'
              rel='noreferrer'
              className='font-medium underline underline-offset-4'
            >
              Team 2
            </a>
            . The source code is available on{' '}
            <a
              href='#'
              target='_blank'
              rel='noreferrer'
              className='font-medium underline underline-offset-4'
            >
              GitHub
            </a>
            .
          </p>
        </div>
        {/* <div className='w-full border-t pt-4 text-center md:w-auto md:border-0 md:pt-0'>
          <Button variant='outline' asChild>
            <Link to='/staff/login'>Staff Portal</Link>
          </Button>
        </div> */}
      </div>
    </footer>
  );
}
