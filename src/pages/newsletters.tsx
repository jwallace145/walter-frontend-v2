'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React from 'react';

export default function Newsletters(): React.ReactElement {
    const getContent: () => React.ReactElement = (): React.ReactElement => {
        return <h1>Newsletters</h1>;
    };

    return <AuthenticatedPageLayout pageName="newsletters" content={getContent()} />;
}
