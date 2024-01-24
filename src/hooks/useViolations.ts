import {useCallback, useMemo} from 'react';
import type {TransactionViolation, ViolationName} from '@src/types/onyx';

/**
 * Names of Fields where violations can occur.
 */
type MoneyRequestField = 'amount' | 'billable' | 'category' | 'comment' | 'date' | 'merchant' | 'receipt' | 'tag' | 'tax';

/**
 * Map from Violation Names to the field where that violation can occur.
 */
const violationFields: Record<ViolationName, MoneyRequestField> = {
    allTagLevelsRequired: 'tag',
    autoReportedRejectedExpense: 'merchant',
    billableExpense: 'billable',
    cashExpenseWithNoReceipt: 'receipt',
    categoryOutOfPolicy: 'category',
    conversionSurcharge: 'amount',
    customUnitOutOfPolicy: 'merchant',
    duplicatedTransaction: 'merchant',
    fieldRequired: 'merchant',
    futureDate: 'date',
    invoiceMarkup: 'amount',
    maxAge: 'date',
    missingCategory: 'category',
    missingComment: 'comment',
    missingTag: 'tag',
    modifiedAmount: 'amount',
    modifiedDate: 'date',
    nonExpensiworksExpense: 'merchant',
    overAutoApprovalLimit: 'amount',
    overCategoryLimit: 'amount',
    overLimit: 'amount',
    overLimitAttendee: 'amount',
    perDayLimit: 'amount',
    receiptNotSmartScanned: 'receipt',
    receiptRequired: 'receipt',
    rter: 'merchant',
    smartscanFailed: 'receipt',
    someTagLevelsRequired: 'tag',
    tagOutOfPolicy: 'tag',
    taxAmountChanged: 'tax',
    taxOutOfPolicy: 'tax',
    taxRateChanged: 'tax',
    taxRequired: 'tax',
};

type ViolationsMap = Map<MoneyRequestField, TransactionViolation[]>;

function useViolations(violations: TransactionViolation[]) {
    const violationsByField = useMemo((): ViolationsMap => {
        const filteredViolations = violations.filter((v) => v.type === 'violation');
        const violationGroups = new Map<MoneyRequestField, TransactionViolation[]>();
        for (const violation of filteredViolations) {
            const field = violationFields[violation.name];
            const existingViolations = violationGroups.get(field) ?? [];
            violationGroups.set(field, [...existingViolations, violation]);
        }
        return violationGroups ?? new Map();
    }, [violations]);

    const getViolationsForField = useCallback((field: MoneyRequestField) => violationsByField.get(field) ?? [], [violationsByField]);

    return {
        getViolationsForField,
    };
}

export default useViolations;
export type {MoneyRequestField};
