define({
    layout: {
        regions: {
            commonImportViewRegion: 'common-import-view',
            archiveLedgerImportViewRegion: 'archive-ledger-import-view'
        }
    },

    views: [{
        name: 'common-import-view',
        region: 'commonImportViewRegion'
    },
    {
        name: 'archive-ledger-import-view',
        region: 'archiveLedgerImportViewRegion'
    }]
});
