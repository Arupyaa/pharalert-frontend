import { NavLink } from 'react-router-dom';
import logoName from '../../assets/logo_name.svg';
import receiptIcon from '../../assets/icons/receipts.svg'

const dashboardItems = ['Dashboard', 'Inventory', 'Sales', 'Receipts', 'Settings'];
export default function RetractableSidebar() {
    return (
        // negative margin to counter the 20px gutter
        < div className='col-span-2 bg-neutral-main h-screen -mr-5' >
            {/* main logo section 60px height */}
            < div className="h-[60px] shadow-sm flex items-center" >
                <img className=' p-4 h-[70px]' src={logoName} alt="logo" />
            </div >
            {/* sidebar items using a for now replace with navlink later */}
            <ul className='px-[5%] py-[20px] w-full space-y-2'>
                {dashboardItems.map((item) => {
                    return (<li key={item}>
                        {/* <NavLink to={`/pharmacy/dashboard/${item}`} className="hover:bg-brand-light">
                        {item}
                    </NavLink> */}
                        <a href="#" className='w-full h-[36px] flex items-center p-4 rounded bg-neutral-main hover:bg-brand-light'>
                        {/*navlink icon using the same one for all temporary  */}
                        <img src={receiptIcon} className='w-6 mr-2' alt='receipt icon'/>
                        <span className='font-bold'>{item}</span>
                        </a>
                    </li>)
                })}
            </ul>

        </div >
    )
}
