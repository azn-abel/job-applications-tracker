import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Flex, Text, TextInput } from '@mantine/core'
import ArchiveAPI from '../../../api/archive'

import { useState } from 'react'

import { rowsAtom } from '../../../state'
import { useAtom } from 'jotai'
import { conditionalS } from '../../../utils'

export default function ArchiveCollectionModal({
  callback,
}: {
  callback: () => void
}) {
  const [opened, { open, close }] = useDisclosure(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const [rows] = useAtom(rowsAtom)

  const archiveCollection = async () => {
    setError('')
    try {
      ArchiveAPI.archiveCollection(name)
      close()
      callback()
      setName('')
    } catch (e: any) {
      setError(e.message)
    }
  }

  const onClose = () => {
    setError('')
    setName('')
    close()
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Archive Applications"
        centered
        removeScrollProps={{
          allowPinchZoom: true,
        }}
        size="md"
      >
        <Flex direction="column" gap={12}>
          <TextInput
            label="Name the collection"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Text>
            This action will archive your current season of applications.
            Archived applications cannot be edited or un-archived.{' '}
          </Text>
          <Text>
            Are you sure you want to archive {rows.length} application
            {conditionalS(rows.length)}?
          </Text>
          {error && <Text>{error}</Text>}
        </Flex>

        <Flex justify="flex-end" mt={16} gap={12}>
          <Button variant="default" onClick={close}>
            Back
          </Button>
          <Button color="red" onClick={archiveCollection}>
            Yes, I'm Sure
          </Button>
        </Flex>
      </Modal>

      <Button onClick={open}>Archive</Button>
    </>
  )
}
