import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Card,
  Grid,
  Text,
  TextInput,
  Flex,
  LoadingOverlay,
  UnstyledButton,
  Center,
  keys,
  Checkbox,
  Group,
  Table,
  Button,
} from "@mantine/core";
import cx from "clsx";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";

import AddApplicationModal from "../components/applications/AddApplicationModal";
import EditApplicationModal from "../components/applications/EditApplicationModal";
import DeleteSelectedApplicationModal from "../components/applications/DeleteSelectedApplicationsModal";
import ImportApplicationsModal from "../components/applications/ImportApplicationsModal";

import classes from "./Index.module.css";

import localStorageAPI from "../api/applications";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { useAtom } from "jotai";
import { rowsAtom, selectedRowsAtom } from "../state";
import { downloadCSV } from "../api/io";
import { conditionalS } from "../utils";

function Home() {
  const [applications, setApplications] = useAtom(rowsAtom);
  const [selectedRows] = useAtom(selectedRowsAtom);
  const numInterviews = applications.filter((app) =>
    ["Interview", "Offer"].includes(app.status)
  ).length;
  const numOffers = applications.filter((app) => app.status === "Offer").length;

  const smallScreen = useMediaQuery("(max-width: 512px)");

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
              <Title order={2}>{applications?.length || 0}</Title>
              <Text size={smallScreen ? "xs" : "md"}>
                Application{conditionalS(applications?.length)}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title order={2}>
                {applications?.filter(
                  (ele) =>
                    ["Interview", "Offer"].includes(ele.status) ||
                    ele.interviewDate
                ).length || 0}
              </Title>
              <Text size={smallScreen ? "xs" : "md"}>
                Interview{conditionalS(numInterviews)}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title order={2}>
                {applications?.filter((ele) => ele.status === "Offer").length ||
                  0}
              </Title>
              <Text size={smallScreen ? "xs" : "md"}>
                Offer{conditionalS(numOffers)}
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
        <Flex justify="space-between" wrap="wrap" gap={12}>
          <Flex gap={12}>
            <Title order={2}>Applications</Title>
          </Flex>
          <Flex gap={12}>
            {selectedRows?.length === 0 && (
              <>
                <AddApplicationModal callback={fillApplications} />
                <ImportApplicationsModal callback={fillApplications} />
              </>
            )}
            {selectedRows?.length > 0 && (
              <DeleteSelectedApplicationModal callback={fillApplications} />
            )}
            {selectedRows?.length > 0 && (
              <Button
                onClick={() =>
                  downloadCSV(
                    applications.filter((row) => selectedRows.includes(row.id))
                  )
                }
              >
                Export
              </Button>
            )}
          </Flex>
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

  const [selection, setSelection] = useAtom(selectedRowsAtom);

  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === applications?.length
        ? []
        : applications?.map((item) => item.id)
    );

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

  const sortedRows = sortedApplications.map((application, index) => {
    const selected = selection.includes(application.id);
    return (
      <Table.Tr
        key={index}
        onClick={() => {
          setSelectedApplication({ ...application });
          open();
        }}
        style={{ cursor: "pointer" }}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <Table.Td>
          <Checkbox
            checked={selection.includes(application.id)}
            onChange={() => {
              toggleRow(application.id);
              close();
            }}
          />
        </Table.Td>
        <Table.Td>{application.jobTitle}</Table.Td>
        <Table.Td>{application.company}</Table.Td>
        <Table.Td>{application.status}</Table.Td>
        <Table.Td>{application.applicationDate}</Table.Td>
        <Table.Td>{application.interviewDate}</Table.Td>
      </Table.Tr>
    );
  });

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
            <Table.Th w={40}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === applications?.length}
                indeterminate={
                  selection.length > 0 &&
                  selection.length !== applications?.length
                }
              />
            </Table.Th>
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
