import { Link, useLocation } from 'react-router-dom';
import { IoHomeSharp } from 'react-icons/io5';
import { IoIosPeople } from 'react-icons/io';
import { MdLeaderboard } from 'react-icons/md';
import { GrCheckboxSelected } from 'react-icons/gr';
const BottomNavigation = () => {
    const location = useLocation().pathname;

    return (
        <div className='btm-nav bg-black flex justify-between items-center z-10'>
            <Link className="flex flex-col rounded-[10px] items-center justify-center text-[13px]" to="/">
                <span className={`w-[60px] h-[34px] flex flex-col rounded-[24px] items-center justify-center text-[13px] ${location === '/' ? 'bg-[#7F6244] text-black' : 'text-white'} `}>
                    <IoHomeSharp className='size-[22px]' />
                </span>
                <span className="font-medium text-white">Home</span>
            </Link>

            {/* <Link className="flex flex-col rounded-[10px] items-center justify-center text-[13px]" to="/mine">
                <span className={`w-[60px] h-[34px] flex flex-col rounded-[24px] items-center justify-center text-[13px] ${location === '/mine' ? 'bg-[#7F6244] text-black' : 'text-white'} `}>
                    <GiSwapBag className='size-[22px]' />
                </span>
                <span className="font-medium text-white">Mine</span>
            </Link> */}
            
            <Link className="flex flex-col rounded-[10px] items-center justify-center text-[13px]" to="/combo">
                <span className={`w-[60px] h-[34px] flex flex-col rounded-[24px] items-center justify-center text-[13px] ${location === '/combo' ? 'bg-[#7F6244] text-black' : 'text-white'} `}>
                    <GrCheckboxSelected className='size-[22px]' />
                </span>
                <span className="font-medium text-white">Combo</span>
            </Link>

            <Link className="flex flex-col rounded-[10px] items-center justify-center text-[13px]" to="/refer">
                <span className={`w-[60px] h-[34px] flex flex-col rounded-[24px] items-center justify-center text-[13px] ${location === '/refer' ? 'bg-[#7F6244] text-black' : 'text-white'} `}>
                    <IoIosPeople className='size-[22px]' />
                </span>
                <span className="font-medium text-white">Friends</span>
            </Link>

            <Link className="flex flex-col rounded-[10px] items-center justify-center text-[13px]" to="/leaderboard">
                <span className={`w-[60px] h-[34px] flex flex-col rounded-[24px] items-center justify-center text-[13px] ${location === '/leaderboard' ? 'bg-[#7F6244] text-black' : 'text-white'} `}>
                    <MdLeaderboard className='size-[22px]' />
                </span>
                <span className="font-medium text-white">Leadership</span>
            </Link>

            
        </div>
    );
};

export default BottomNavigation;