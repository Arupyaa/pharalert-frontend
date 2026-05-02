import React from 'react'
import DashboardCard from './DashboardCard/DbCard'
import DbCardHeader from './DashboardCard/DbCardHeader'
import DbCardBodySection from './DashboardCard/DbCardBodySection'
import DbCardFooter from './DashboardCard/DbCardFooter'
import DbCardBody from './DashboardCard/DbCardBody'
import SalesIcon from '../svg/SalesIcon'
import Select from '../../../components/shared/SelectMenu'
import SelectMenu from '../../../components/shared/SelectMenu'

export default function PDashboardMain() {
    return (
        <div className='flex-1 bg-neutral-secondary w-full flex h-full justify-center items-center'>
            {/* navbar containing account name and avatar */}
            <SelectMenu/>
        </div>
    )
}
