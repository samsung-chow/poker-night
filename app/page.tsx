import Link from 'next/link';

type LandingButtonProps = {
  children: React.ReactNode;  // use react.reactnode so we can pass in anything
  href: string;
};

export default function Home() {
  return (
    <div>
    </div>
  );
}

function LandingButton({children, href}: LandingButtonProps){
  return(
    <a className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        href={href}>
          {children}
    </a>
  );
}
