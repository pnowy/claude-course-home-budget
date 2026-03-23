# Expenses Report: {{MONTH_NAME}} {{YEAR}}

> Generated on {{GENERATED_DATE}} | Currency: {{CURRENCY}}

---

## Summary

| Metric                  | Value                                                     |
|-------------------------|-----------------------------------------------------------|
| Total Expenses          | {{TOTAL_AMOUNT}} {{CURRENCY}}                             |
| Transactions            | {{TRANSACTION_COUNT}}                                     |
| Average per Transaction | {{AVERAGE_AMOUNT}} {{CURRENCY}}                           |
| Daily Average           | {{DAILY_AVERAGE}} {{CURRENCY}}                            |
| Highest Expense         | {{HIGHEST_AMOUNT}} {{CURRENCY}} ({{HIGHEST_DESCRIPTION}}) |
| Lowest Expense          | {{LOWEST_AMOUNT}} {{CURRENCY}} ({{LOWEST_DESCRIPTION}})   |

---

## Spending by Category

| Category | Amount | % of Total | Transactions |
|----------|--------|------------|--------------|
{{CATEGORY_ROWS}}

---

## Top 5 Expenses

| # | Date | Description | Category | Amount |
|---|------|-------------|----------|--------|
{{TOP_EXPENSES_ROWS}}

---

## Daily Spending

```
{{DAILY_CHART}}
```

---

## Notes

- Report covers **{{DAYS_IN_MONTH}} days** ({{FIRST_DATE}} to {{LAST_DATE}})
- **{{DAYS_WITH_EXPENSES}} days** had recorded expenses
- All amounts in **{{CURRENCY}}**
