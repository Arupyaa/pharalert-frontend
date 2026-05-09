import React, { useEffect, useState } from "react";
import DashboardCard from './DashboardCard/DbCard'
import DbCardHeader from './DashboardCard/DbCardHeader'
import DbCardBodySection from './DashboardCard/DbCardBodySection'
import DbCardFooter from './DashboardCard/DbCardFooter'
import DbCardBody from './DashboardCard/DbCardBody'
import SalesIcon from '../svg/SalesIcon'
import SearchBar from '../../../components/shared/SearchBar'

export default function PDashboardMain() {


  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://randomuser.me/api/?results=20"
        );

        const result = await response.json();


        const formattedUsers = result.results.map(
          (user) =>
            `${user.name.first} ${user.name.last}`
        );

        setUsers(formattedUsers);
      } catch (error) {
        console.error(error);
      }
    };  

    fetchUsers();
  }, []);

    return (
        <div className='flex-1 bg-neutral-secondary w-full flex h-full justify-center items-center'>
            {/* navbar containing account name and avatar */}

            <SearchBar
                    data={users}
                    placeholder="Search users..."
                    onSelect={(value) => console.log(value)}
                    onSubmit={(value) => console.log(value)}
                    size="md"
                    />
        </div>
    )
}
