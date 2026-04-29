import React from 'react'
import DashboardCard from './DashboardCard/DbCard'
import DbCardHeader from './DashboardCard/DbCardHeader'
import DbCardBodySection from './DashboardCard/DbCardBodySection'
import DbCardFooter from './DashboardCard/DbCardFooter'
import DbCardBody from './DashboardCard/DbCardBody'

export default function PDashboardMain() {
    return (
        <div className='flex-1 bg-neutral-secondary w-full flex justify-center items-center'>
            {/* navbar containing account name and avatar */}
            <DashboardCard>
                <DbCardHeader
                propClassName='text-3xl text-brand-dark'
                >
                    Customers & Sales
                </DbCardHeader>
                <DbCardBody
                    orderReverse={false}
                    col={true}
                    divClassName='gap-y-2'
                    content={
                        { value: "1,240", valueClassName: "text-amber-300", label: "Customers", labelClassName: "" }
                    } />
                <DbCardBodySection
                    content={[
                        { value: "1,240", valueClassName: "text-start", label: "Customers", labelClassName: "text-start text-blue-400",containingDivClassName:"" },
                        { value: "1,240", valueClassName: "text-start", label: "Customers", labelClassName: "text-start",containingDivClassName:"" },
                        { value: "1,240", valueClassName: "text-start", label: "Customers", labelClassName: "text-start",containingDivClassName:"" }
                    ]} />
                <DbCardFooter>
                    View Report
                </DbCardFooter>
            </DashboardCard>
        </div>
    )
}
