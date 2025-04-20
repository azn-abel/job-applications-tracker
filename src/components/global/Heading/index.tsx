import { Container, Text, Group } from '@mantine/core'
import { useState, useEffect } from 'react'
import classes from './Heading.module.css'

import { Link } from 'react-router'

const links = [
  { link: '/', label: 'Home' },
  { link: '/visualize', label: 'Visualize' },
]

export default function Heading() {
  const [active, setActive] = useState(window.location.pathname)
  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        setActive(link.link)
      }}
    >
      {link.label}
    </Link>
  ))

  useEffect(() => {
    const handlePathChange = () => {
      setActive(window.location.pathname)
    }

    window.addEventListener('popstate', handlePathChange)
    window.addEventListener('locationchange', handlePathChange)

    return () => {
      window.removeEventListener('popstate', handlePathChange)
      window.removeEventListener('locationchange', handlePathChange)
    }
  }, [])

  return (
    <header
      className={classes.header}
      style={{ zIndex: 200, position: 'relative' }}
    >
      <Container size="md" className={classes.inner}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <Text>Job Tracker</Text>
        </Link>
        <Group gap={5}>{items}</Group>
      </Container>
    </header>
  )
}
