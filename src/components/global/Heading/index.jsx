import { Container, Text, Group } from "@mantine/core";
import { useState } from "react";
import classes from "./Heading.module.css";

const links = [
  { link: "/", label: "Home" },
  { link: "/visualize", label: "Visualize" },
];

export default function Heading() {
  const [active, setActive] = useState(window.location.path);
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));
  return (
    <header
      className={classes.header}
      style={{ zIndex: 200, position: "relative" }}
    >
      <Container size="md" className={classes.inner}>
        <Text>Job Tracker</Text>
        <Group gap={5}>{items}</Group>
      </Container>
    </header>
  );
}
