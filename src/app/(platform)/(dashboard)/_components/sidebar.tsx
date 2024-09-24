'use client'

import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'

import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NavItem, Organization } from './nav-item'

type SidebarProps = {
  storageKey?: string
}

export function Sidebar({ storageKey = 't-sidebar-state' }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {})
  const { organization: activeOrganization, isLoaded: isLoadedOrg } = useOrganization()
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key)
      }
      return acc
    },
    []
  )

  const onExpand = (id: string) => {
    setExpanded((curr) => ({ ...curr, [id]: !expanded[id] }))
  }

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-1 flex items-center text-sm font-medium">
        <span className="pl-4">Workspaces</span>
        <Button type="button" size="icon" variant="ghost" className="ml-auto" asChild>
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={defaultAccordionValue} className="space-y-2">
        {userMemberships.data?.map(({ organization }) => (
          <NavItem
            isActive={organization.id === activeOrganization?.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
            key={organization.id}
          />
        ))}
      </Accordion>
    </>
  )
}
