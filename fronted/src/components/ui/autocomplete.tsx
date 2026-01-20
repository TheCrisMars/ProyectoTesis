'use client'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

// Defined inline as the constants file does not exist
const ITEMS_IN_SELECT = 10

type SelectOptions = {
    key: string
    label: string | null
}

type ClassNames = {
    label?: string
    content?: string
    buttonLabel?: string
    trigger?: string
    contentTrigger?: string
}

type PropsAutoComplete = {
    data: SelectOptions[]
    value: string
    onChange: (value: string) => void
    type?: 'text' | 'number'
    classNames?: ClassNames
    customPlaceholder?: string
}

export function AutoComplete({
    data,
    value: propValue,
    type = 'text',
    classNames,
    customPlaceholder,
    ...props
}: Readonly<PropsAutoComplete>) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string | number | null>(propValue || null)
    const [visibleOptions, setVisibleOptions] = useState<SelectOptions[]>([])
    const [input, setInput] = useState('')

    useEffect(() => {
        const initialOptions = data.slice(0, ITEMS_IN_SELECT)
        const selectedOption = data.find((option) => option.key === propValue)

        if (
            selectedOption &&
            !initialOptions.some((option) => option.key === selectedOption.key)
        ) {
            setVisibleOptions([selectedOption, ...initialOptions])
        } else {
            setVisibleOptions(initialOptions)
        }
    }, [data, propValue])

    useEffect(() => {
        setValue(propValue)
    }, [propValue])

    useEffect(() => {
        const filteredOptions = data.filter((option) =>
            (option.label ?? '').toLowerCase().includes(input.toLowerCase())
        )
        setVisibleOptions(filteredOptions.slice(0, ITEMS_IN_SELECT))
    }, [input, data])

    const loadMoreItems = () => {
        const filteredOptions = data.filter((option) =>
            (option.label ?? '').toLowerCase().includes(input.toLowerCase())
        )
        setVisibleOptions((prev) => [
            ...prev,
            ...filteredOptions.slice(prev.length, prev.length + ITEMS_IN_SELECT)
        ])
    }

    const selectedLabel = value
        ? data.find((option) => option.key === String(value))?.label ?? (customPlaceholder ?? 'Select...')
        : (customPlaceholder ?? 'Select...')

    const handleSelect = (label: string) => {
        const selectedOption = data.find((option) => option.label === label)
        if (selectedOption) {
            const isSame = selectedOption.key === value

            if (isSame) {
                setValue('')
                props.onChange('')
            } else {
                setValue(
                    type === 'number' ? Number(selectedOption.key) : selectedOption.key
                )
                props.onChange(selectedOption.key)
            }
        }
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='ghost'
                    role='combobox'
                    aria-expanded={open}
                    className={cn(
                        'w-full flex items-center justify-between gap-2 text-left p-2 border border-input rounded-md h-10', // Added border and height to match Shadcn Inputs
                        classNames?.buttonLabel
                    )}
                >
                    <div
                        className={cn(
                            'flex-1 break-words whitespace-pre-wrap truncate', // Added truncate
                            classNames?.label
                        )}
                    >
                        {selectedLabel}
                    </div>
                    <ChevronsUpDown className='h-4 w-4 opacity-50 shrink-0' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 m-0 z-50 w-[var(--radix-popover-trigger-width)]'>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder='Buscar...'
                        value={input}
                        onValueChange={setInput}
                    />
                    <CommandList className='max-h-64 overflow-auto'>
                        <CommandEmpty>{'No se encontraron opciones.'}</CommandEmpty>
                        <CommandGroup>
                            {visibleOptions.map((option) => (
                                <CommandItem
                                    key={option.key}
                                    value={option.label ?? ''}
                                    onSelect={() => handleSelect(option.label ?? '')}
                                    className='cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100'
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === option.key ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {option.label ?? ''}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {visibleOptions.length <
                            data.filter((option) =>
                                (option.label ?? '').toLowerCase().includes(input.toLowerCase())
                            ).length && (
                                <div className='text-center my-2'>
                                    <Button onClick={loadMoreItems} size='sm' variant="ghost">
                                        Cargar más
                                    </Button>
                                </div>
                            )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
