import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Card,
  Grid,
  Text,
  TextInput,
  Table,
  Flex,
  LoadingOverlay,
  UnstyledButton,
  Group,
  Center,
  keys,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";

import AddApplicationModal from "../components/applications/AddApplicationModal";
import EditApplicationModal from "../components/applications/EditApplicationModal";

import classes from "./Index.module.css";

import localStorageAPI from "../api/applications";

import { useDisclosure } from "@mantine/hooks";

function Home() {
  const [applications, setApplications] = useState([]);

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
          style={{ overflowX: "scroll" }}
          className="hide-scroll"
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

  const [search, setSearch] = useState("");
  const [sortedApplications, setSortedApplications] = useState(applications);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState({});

  useEffect(() => {
    setSortedApplications(applications);
  }, [applications]);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedApplications(
      sortData(applications, { sortBy: field, reversed, search })
    );
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedApplications(
      sortData(applications, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const sortedRows = sortedApplications.map((application, index) => (
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
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Th
              sorted={sortBy === "jobTitle"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("jobTitle")}
            >
              Job Title
            </Th>
            <Th
              sorted={sortBy === "company"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("company")}
            >
              Company
            </Th>
            <Th
              sorted={sortBy === "status"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("status")}
            >
              Status
            </Th>
            <Th
              sorted={sortBy === "applicationDate"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("applicationDate")}
            >
              Application Date
            </Th>
            <Th
              sorted={sortBy === "interviewDate"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("interviewDate")}
            >
              Interview Date
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{sortedRows}</Table.Tbody>
      </Table>
    </>
  );
}

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key]?.toLowerCase().includes(query))
  );
}

function sortData(data, { sortBy, reversed, search }) {
  if (!sortBy) {
    return filterData(data, search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (!a[sortBy] && !b[sortBy]) return 0;
      if (!a[sortBy]) return 1;
      if (!b[sortBy]) return -1;
      if (reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    search
  );
}

export default Home;
