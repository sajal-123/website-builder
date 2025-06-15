import { getAuthUserDetails,verifyAndAcceptInvitation} from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

async function AgencyDashboard() {

    const agencyId=await verifyAndAcceptInvitation()
    console.log('agencyId', agencyId)

    const User=await getAuthUserDetails();
  return (
    <div>AgencyDashboard</div>
  )
}

export default AgencyDashboard