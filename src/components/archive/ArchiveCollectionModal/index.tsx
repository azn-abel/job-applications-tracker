import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Flex, Text, TextInput } from '@mantine/core'
import ArchiveAPI from '../../../api/archive'

import { useState } from 'react'

import { rowsAtom, selectedRowsAtom } from '../../../state'
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

  const [rows] = useAtom(selectedRowsAtom)

  const archiveCollection = async () => {
    setError('')
    try {
      ArchiveAPI.archiveApplications(rows)
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
        onClose={onClose}
        title="Archive Applications"
        centered
        removeScrollProps={{
          allowPinchZoom: true,
        }}
        size="md"
      >
        <Flex direction="column" gap={12}>
          <Text>
            This action will archive the selected applications and cannot be
            undone.
          </Text>
          <Text>
            Are you sure you want to archive {rows.length} application
            {conditionalS(rows.length)}?
          </Text>
          {error && (
            <Text size="xs" c="red">
              {error}
            </Text>
          )}
        </Flex>

        <Flex justify="flex-end" mt={16} gap={12}>
          <Button variant="default" onClick={onClose}>
            Back
          </Button>
          <Button color="red" onClick={archiveCollection}>
            Yes, I'm Sure
          </Button>
        </Flex>
      </Modal>

      <Button disabled={rows.length === 0} onClick={open}>
        Archive
      </Button>
    </>
  )
}
