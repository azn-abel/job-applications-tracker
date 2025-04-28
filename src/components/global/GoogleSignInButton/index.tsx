import { useEffect, useRef } from 'react'
import { fetchCurrentUser, sendGoogleToken } from '@/api/auth'

import classes from './GoogleSignInButton.module.css'
import useAuth from '@/hooks/auth'

export default function GoogleSignInButton() {
  const buttonDivRef = useRef<HTMLDivElement>(null)

  const { login } = useAuth()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google && buttonDivRef.current) {
        window.google.accounts.id.initialize({
          client_id:
            '550007723780-6d7vd2gcfer5ki3vcie9jaiuugu2caab.apps.googleusercontent.com',
          context: 'signin',
          ux_mode: 'popup',
          login_uri: import.meta.env.BASE_URL,
          auto_select: false,
          callback: async (response) => {
            await login(response.credential)
          },
        })

        window.google.accounts.id.renderButton(buttonDivRef.current, {
          type: 'standard',
          shape: 'rectangular',
          theme: 'outline',
          text: 'signin',
          size: 'medium',
          logo_alignment: 'center',
          width: 40,
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return <div className={classes['google-btn']} ref={buttonDivRef}></div>
}
