import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Card,
  Grid,
  Text,
  Table,
  Flex,
  LoadingOverlay,
} from "@mantine/core";

import AddApplicationModal from "../components/applications/AddApplicationModal";
import EditApplicationModal from "../components/applications/EditApplicationModal";

import localStorageAPI from "../api/applications";

import { useDisclosure } from "@mantine/hooks";

function Home() {
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fillApplications = async () => {
    const response = localStorageAPI.fetchApplications();
    if (!response) {
      // something went wrong
      return;
    }
    setApplications(response);
  };

  useEffect(() => {
    fillApplications();
  }, []);

  return (
    <>
      <LoadingOverlay visible={false} zIndex={199} />
      <Container pos="relative">
        <Title order={2}>Stats</Title>
        <Grid mt={24} mb={24}>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title>{applications?.length || 0}</Title>
              <Text>Applications</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title>
                {applications?.filter(
                  (ele) =>
                    ["Interview", "Offer"].includes(ele.status) ||
                    ele.interviewDate
                ).length || 0}
              </Title>
              <Text>Interviews</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title>
                {applications?.filter((ele) => ele.status === "Offer").length ||
                  0}
              </Title>
              <Text>Offers</Text>
            </Card>
          </Grid.Col>
        </Grid>
        <Flex justify="space-between">
          <Title order={2}>Applications</Title>
          <AddApplicationModal callback={fillApplications} />
        </Flex>
        <Card
          mt={24}
          mb={24}
          radius={8}
          shadow="md"
          style={{ overflow: "scroll" }}
        >
          <ApplicationsTable
            applications={applications}
            callback={fillApplications}
          />
        </Card>
      </Container>
    </>
  );
}

function ApplicationsTable({ applications, callback }) {
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedApplication, setSelectedApplication] = useState({});

  const rows = applications?.map((application, index) => (
    <Table.Tr
      key={index}
      onClick={() => {
        setSelectedApplication({ ...application });
        open();
      }}
      style={{ cursor: "pointer" }}
    >
      <Table.Td>{application.jobTitle}</Table.Td>
      <Table.Td>{application.company}</Table.Td>
      <Table.Td>{application.status}</Table.Td>
      <Table.Td>{application.applicationDate}</Table.Td>
      <Table.Td>{application.interviewDate}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <EditApplicationModal
        opened={opened}
        open={open}
        close={close}
        application={selectedApplication}
        callback={callback}
      />
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Job Title</Table.Th>
            <Table.Th>Company</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Application Date</Table.Th>
            <Table.Th>Interview Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}

export default Home;
