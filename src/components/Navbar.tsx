import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <div className='flex justify-center bg-white border-b-2 shadow-lg'>
        <Link href='/' passHref>
          <p className='p-4 ml-4 font-bold border-b-4 border-white cursor-pointer hover:border-rattata-500 hover:bg-charmander hover:text-white'>
            Directory
          </p>
        </Link>
        <Link href='/stories' passHref>
          <p className='p-4 ml-4 font-bold border-b-4 border-white cursor-pointer hover:border-rattata-500 hover:bg-charmander hover:text-white'>
            Stories
          </p>
        </Link>
        <Link href='/videos' passHref>
          <p className='p-4 ml-4 font-bold border-b-4 border-white cursor-pointer hover:border-rattata-500 hover:bg-charmander hover:text-white'>
            Videos
          </p>
        </Link>
      </div>
    </nav>
  );
}
