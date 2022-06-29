import React from 'react'
import { CheckinInsights } from './checkin-insights'
import MobileCheckinInsights from './mobile-checkin-insights'

const CheckinInsightsIndex = (): JSX.Element => {
  return (
    <>
      <CheckinInsights />
      <MobileCheckinInsights />
    </>
  )
}

export default CheckinInsightsIndex