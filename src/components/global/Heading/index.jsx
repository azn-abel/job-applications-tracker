import { Container, Text } from "@mantine/core";
import classes from "./Heading.module.css";

export default function Heading() {
  return (
    <header
      className={classes.header}
      style={{ zIndex: 200, position: "relative" }}
    >
      <Container size="md" className={classes.inner}>
        <Text>Job Tracker</Text>
      </Container>
    </header>
  );
}
