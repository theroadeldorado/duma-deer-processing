type Props = {
  children: React.ReactNode;
};

export default async function UserLayout({ children }: Props) {
  return <div className='utility-page flex flex-col justify-center py-12 sm:px-6 md:min-h-[800px] lg:px-8'>{children}</div>;
}
