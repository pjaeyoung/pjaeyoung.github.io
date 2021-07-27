import React from 'react'

import { ThemeSwitch } from '../components/theme-switch'
import { Footer } from '../components/footer'
import './index.scss'

export const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          padding: "20px 100px"
        }}
      >
        <ThemeSwitch />
        {children}
        <Footer />
      </div>
    </React.Fragment>
  )
}
