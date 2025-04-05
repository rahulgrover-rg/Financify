"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { columns } from '@/app/(dashboard)/transactions/columns';
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { transactions as transactionsSchema } from '@/db/schema'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { UploadButton } from '@/app/(dashboard)/transactions/upload-button'
import { ImportCard } from '@/app/(dashboard)/transactions/import-card'
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'

enum VARIANTS {
    LIST = "LIST" ,
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
};

const Transactions = () => {

    const [AccountDialog,confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    }

    const onCancelImports = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [] ;
    const deleteTransactions = useBulkDeleteTransactions();
    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending ;

    const onSubmitImport = async(values: typeof transactionsSchema.$inferInsert[],) => {
        const accountId = await confirm();
        if(!accountId) {
            return toast.error("Please select an account to continue.")
        }

        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string,
        }));

        createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImports();
            },
        })
    }

    if(transactionsQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                <CardHeader>
                    <Skeleton className='w-48 h-8' />
                </CardHeader>
                <CardContent>
                    <div className="h-[500px] w-full flex items-center justify-center">
                        <Loader2 className='size-6 text-slate-300 animate-spin' />
                    </div>
                </CardContent>
                </Card>
            </div>
        )
    }

    if(variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard data={importResults.data} onCancel={onCancelImports} onSubmit={onSubmitImport}/>
            </>
        )
    }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='gap-y-2 lg:flex lg:items-center lg:justify-between'>
                <CardTitle className='text-xl line-clamp-1'>
                    Transactions Page
                </CardTitle>
                <div className='flex flex-col lg:flex-row gap-y-2 items-center gap-x-2'>
                    <Button onClick={newTransaction.onOpen} size="sm" className='w-full lg:w-auto'>
                        <Plus className='size-4 mr-2' />
                        Add new
                    </Button>
                    <UploadButton onUpload={onUpload}/>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable filterKey='payee' 
                columns={columns} 
                data={transactions} 
                onDelete={(row)=>{
                    const ids = row.map((r) => r.original.id) ;
                    deleteTransactions.mutate({ids}) ;
                }} disabled={isDisabled}/>
            </CardContent>
        </Card>
    </div>
  )
}

export default Transactions