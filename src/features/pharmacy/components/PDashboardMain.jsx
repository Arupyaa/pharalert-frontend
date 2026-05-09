import React from 'react'
import DashboardCard from './DashboardCard/DbCard'
import DbCardHeader from './DashboardCard/DbCardHeader'
import DbCardBodySection from './DashboardCard/DbCardBodySection'
import DbCardFooter from './DashboardCard/DbCardFooter'
import DbCardBody from './DashboardCard/DbCardBody'
import SalesIcon from '../svg/SalesIcon'
import Select from '../../../components/shared/SelectMenu'
import SelectMenu from '../../../components/shared/SelectMenu'
import TabsLinks from '../../../components/shared/RetractableSidebar/Tabslink'
import Badge from '../../../pages/pharmacy/Badge'
import Card from '../../../pages/pharmacy/Card'



export default function PDashboardMain() {
    return (
        <div className='flex-1 bg-neutral-secondary w-full flex h-full justify-center items-center'>
             <Card
        name="Pharalert Pharmacy"
        address="Cairo"
        image="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop"
        isOpen={false}
        latitude={30.0384}
        longitude={31.2101}

        
      />


    
        </div>
    )
}
