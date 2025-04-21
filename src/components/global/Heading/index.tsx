import { Container, Text, Group, Burger, Flex, Card } from '@mantine/core'
import { useState, useEffect } from 'react'
import classes from './Heading.module.css'

import { Link } from 'react-router'
import { useDisclosure } from '@mantine/hooks'

const links = [
  { link: '/', label: 'Home' },
  { link: '/visualize', label: 'Visualize' },
  { link: '/archive', label: 'Archive' },
]

export default function Heading() {
  const [opened, { toggle }] = useDisclosure(false)
  const [active, setActive] = useState(window.location.pathname)
  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        toggle()
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
      <Container size="md" className={classes.inner} pos="relative">
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <Text>Job Tracker</Text>
        </Link>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        <Card
          shadow="md"
          radius={8}
          hiddenFrom="xs"
          display={opened ? 'block' : 'none'}
          pos="absolute"
          top={56}
          right={8}
        >
          <Flex
            className={classes.links}
            direction={'column'}
            gap={8}
            bg={'white'}
          >
            {items}
          </Flex>
        </Card>
      </Container>
    </header>
  )
}
