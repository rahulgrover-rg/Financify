import * as React from 'react'
import { Calendar as CalendarIcon } from "lucide-react"
import 'react-day-picker/dist/style.css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

type Props = {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const DatePicker = ({value,onChange,disabled}:Props) => {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button disabled={disabled} variant="outline" className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
            )}>
                <CalendarIcon className='size-4 mr-2' />
                {value ? format(value,"PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
            <Calendar 
                mode="single"
                selected={value}
                onSelect={onChange}
                disabled={disabled}
            />
        </PopoverContent>
    </Popover>
  )
}