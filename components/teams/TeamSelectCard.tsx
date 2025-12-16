'use client'

import { Check } from 'lucide-react'
import Image from 'next/image'
import clsx from 'clsx'
import { UserTeam } from '@/types/team'

type TeamSelectCardProps = {
  team: UserTeam
  selected: boolean
  onSelect: () => void
}

export function TeamSelectCard({
  team,
  selected,
  onSelect,
}: TeamSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'relative w-full rounded-xl border p-4 text-left transition-all',
        'flex items-center gap-4',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      )}
    >
      {/* Logo */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
        {team.logo ? (
          <Image
            src={team.logo}
            alt={team.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            Logo
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{team.name}</p>
        <p className="text-sm text-gray-500">
          {team.sport.name} • {team.category?.name || 'Sem categoria'}
        </p>

        {team.hasField && (
          <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            🏟️ Campo próprio
          </span>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Check size={14} />
        </div>
      )}
    </button>
  )
}
