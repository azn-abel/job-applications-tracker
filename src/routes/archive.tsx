import { useState, useEffect, ChangeEvent } from 'react'
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
  Select,
} from '@mantine/core'
import cx from 'clsx'
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
  IconFileExport,
  IconTrash,
} from '@tabler/icons-react'

import AddApplicationModal from '../components/applications/AddApplicationModal'
import EditApplicationModal from '../components/applications/EditApplicationModal'
import DeleteSelectedApplicationModal from '../components/applications/DeleteSelectedApplicationsModal'
import ImportApplicationsModal from '../components/applications/ImportApplicationsModal'

import classes from './Index.module.css'

import ApplicationsAPI from '../api/applications'

import { useDisclosure, useMediaQuery } from '@mantine/hooks'

import { useAtom } from 'jotai'
import { rowsAtom, selectedRowsAtom } from '../state'
import { downloadCSV } from '../api/io'
import { conditionalS } from '../utils'

import { Application, ApplicationDTO } from '../types/applications'

import { ReactNode } from 'react'

export default function Archive() {
  const [applications, setApplications] = useAtom(rowsAtom)
  const [selectedRows] = useAtom(selectedRowsAtom)
  const numInterviews = applications.filter((app) =>
    ['Interview', 'Offer'].includes(app.status)
  ).length
  const numOffers = applications.filter((app) => app.status === 'Offer').length

  const smallScreen = useMediaQuery('(max-width: 512px)')

  const fillApplications = async () => {
    const response = ApplicationsAPI.fetchApplications()
    if (!response) {
      // something went wrong
      return
    }
    setApplications(response)
  }

  useEffect(() => {
    fillApplications()
  }, [])

  return (
    <>
      <LoadingOverlay visible={false} zIndex={199} />
      <Container pos="relative">
        <Flex justify="space-between" align="center" wrap="wrap">
          <Title>Archive</Title>
          <Select data={['All']} defaultValue="All" />
        </Flex>
        <Grid mt={24} mb={24}>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title order={2}>{applications?.length || 0}</Title>
              <Text size={smallScreen ? 'xs' : 'md'}>
                Application{conditionalS(applications?.length)}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title order={2}>
                {applications?.filter(
                  (ele) =>
                    ['Interview', 'Offer'].includes(ele.status) ||
                    ele.interviewDate
                ).length || 0}
              </Title>
              <Text size={smallScreen ? 'xs' : 'md'}>
                Interview{conditionalS(numInterviews)}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="md" radius={8}>
              <Title order={2}>
                {applications?.filter((ele) => ele.status === 'Offer').length ||
                  0}
              </Title>
              <Text size={smallScreen ? 'xs' : 'md'}>
                Offer{conditionalS(numOffers)}
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
        <Flex justify="space-between" wrap="wrap" gap={12}>
          <Flex gap={12}>
            <Title order={2}>Applications</Title>
          </Flex>
          <Flex gap={12} align="center">
            <Button variant="default">
              {smallScreen ? <IconFileExport /> : 'Export CSV'}
            </Button>
            <Button color="red">
              {smallScreen ? <IconTrash /> : 'Delete'}
            </Button>
          </Flex>
        </Flex>
        <Card
          mt={24}
          mb={24}
          radius={8}
          shadow="md"
          style={{ overflowX: 'scroll' }}
          className="hide-scroll"
        >
          <ApplicationsTable
            applications={applications}
            callback={fillApplications}
          />
        </Card>
      </Container>
    </>
  )
}

function ApplicationsTable({
  applications,
  callback,
}: {
  applications: Application[]
  callback: () => void
}) {
  const [opened, { open, close }] = useDisclosure(false)

  const [search, setSearch] = useState('')
  const [sortedApplications, setSortedApplications] = useState(applications)
  const [sortBy, setSortBy] = useState<keyof ApplicationDTO | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null)

  const [selection, setSelection] = useAtom(selectedRowsAtom)

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  const toggleAll = () =>
    setSelection((current) =>
      current.length === applications.length
        ? []
        : applications.map((item) => item.id as string)
    )

  useEffect(() => {
    setSortedApplications(applications)
  }, [applications])

  const setSorting = (field: keyof Application) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedApplications(
      sortData(applications, { sortBy: field, reversed, search })
    )
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    setSortedApplications(
      sortData(applications, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    )
  }

  const sortedRows = sortedApplications.map((application, index) => {
    const selected = selection.includes(application.id as string)
    return (
      <Table.Tr
        key={index}
        onClick={() => {
          setSelectedApplication({ ...application })
          open()
        }}
        style={{ cursor: 'pointer' }}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <Table.Td>{application.jobTitle}</Table.Td>
        <Table.Td>{application.company}</Table.Td>
        <Table.Td>{application.status}</Table.Td>
        <Table.Td>{application.applicationDate}</Table.Td>
        <Table.Td>{application.interviewDate}</Table.Td>
      </Table.Tr>
    )
  })

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
              sorted={sortBy === 'jobTitle'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('jobTitle')}
            >
              Job Title
            </Th>
            <Th
              sorted={sortBy === 'company'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('company')}
            >
              Company
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
            >
              Status
            </Th>
            <Th
              sorted={sortBy === 'applicationDate'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('applicationDate')}
            >
              Application Date
            </Th>
            <Th
              sorted={sortBy === 'interviewDate'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('interviewDate')}
            >
              Interview Date
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{sortedRows}</Table.Tbody>
      </Table>
    </>
  )
}

function Th({
  children,
  reversed,
  sorted,
  onSort,
}: {
  children: ReactNode
  reversed: boolean
  sorted: boolean
  onSort: () => void
}) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector
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
  )
}

function filterData(data: Application[], search: string) {
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key]?.toLowerCase().includes(query))
  )
}

function sortData(
  data: Application[],
  {
    sortBy,
    reversed,
    search,
  }: { sortBy: keyof ApplicationDTO | null; reversed: Boolean; search: string }
) {
  if (!sortBy) {
    return filterData(data, search)
  }

  return filterData(
    [...data].sort((a, b) => {
      if (!a[sortBy] && !b[sortBy]) return 0
      if (!a[sortBy]) return 1
      if (!b[sortBy]) return -1
      if (reversed) {
        return b[sortBy].localeCompare(a[sortBy])
      }

      return a[sortBy].localeCompare(b[sortBy])
    }),
    search
  )
}
