---
name: expenses-summary
description: Activate this skill when the user asks to generate an expense summary, monthly report, spending breakdown, or financial report for a specific month (e.g., "expense summary for 2026-02", "how much did I spend in January?", "generate a spending report", "spending breakdown for March"). Also activate when the user wants to export expenses as a markdown file, review monthly budget data, or check category-level spending. The user should provide a month in YYYY-MM format (e.g., 2026-01). If the user gives a natural language month (e.g., "January 2026"), convert it to YYYY-MM format.
argument-hint: month in YYYY-MM format (e.g., 2026-01)
---

# Expenses Summary Skill

## How It Works

This skill follows a three-step pipeline: **query data** -> **fill template** -> **write report**.

> **WHY this pattern?** Separating data extraction (script) from presentation
> (template) is a fundamental software design principle. The script can be reused
> with different templates, and the template can be updated without touching the
> query logic. The JSON intermediate format makes each step independently testable.

---

## Step 1: Query the Database

Run the query script to extract expense data for the target month:

```bash
npx tsx .claude/skills/expenses-summary/scripts/query-expenses.ts YYYY-MM
```

The script:
- Queries the SQLite database via Drizzle ORM
- Joins expenses with categories to get category names
- Computes summary statistics (totals, averages, breakdowns)
- Outputs structured JSON to stdout

> **WHY a separate script?** Running a TypeScript script lets us use the same
> Drizzle ORM and database connection that the app uses. The script handles the
> tricky ESM/dotenv ordering (loading environment variables before the database
> module initializes) so you don't have to think about it.

**If the script fails** (e.g., empty database, missing env file), inform the user.
Common fixes:
- Run `npm run db:push` to ensure the schema exists
- Check that `.env.local` contains `DATABASE_URL="dev.db"`
- Ensure there are expenses in the database for the requested month

**If the script returns zero transactions**, still generate the report using the
template — it will show zeroes and empty tables, which is valid.

---

## Step 2: Fill the Template

Read the template from:
```
.claude/skills/expenses-summary/templates/monthly-report.md
```

Replace each `{{PLACEHOLDER}}` with values from the JSON output.

### Placeholder Reference

| Placeholder | JSON Path | Format |
|-------------|-----------|--------|
| `{{MONTH_NAME}}` | `month.monthName` | As-is (e.g., "January") |
| `{{YEAR}}` | `month.year` | As-is (e.g., 2026) |
| `{{GENERATED_DATE}}` | `metadata.generatedAt` | YYYY-MM-DD |
| `{{CURRENCY}}` | `currency` | As-is (e.g., "PLN") |
| `{{TOTAL_AMOUNT}}` | `summary.totalAmount` | Thousands separator (e.g., "4,105.00") |
| `{{TRANSACTION_COUNT}}` | `summary.transactionCount` | Integer |
| `{{AVERAGE_AMOUNT}}` | `summary.averageAmount` | Two decimals (e.g., "684.17") |
| `{{DAILY_AVERAGE}}` | `summary.dailyAverage` | Two decimals (e.g., "132.42") |
| `{{HIGHEST_AMOUNT}}` | `summary.highest.amount` | Thousands separator |
| `{{HIGHEST_DESCRIPTION}}` | `summary.highest.description` | As-is |
| `{{LOWEST_AMOUNT}}` | `summary.lowest.amount` | Thousands separator |
| `{{LOWEST_DESCRIPTION}}` | `summary.lowest.description` | As-is |

> **Null handling:** When `summary.highest` or `summary.lowest` is `null` (zero
> transactions), render **"N/A"** for the entire value cell instead of filling
> individual placeholders. For example: `| Highest Expense | N/A |`

| `{{DAYS_IN_MONTH}}` | `metadata.daysInMonth` | Integer |
| `{{DAYS_WITH_EXPENSES}}` | `metadata.daysWithExpenses` | Integer |
| `{{FIRST_DATE}}` | `metadata.firstDate` | YYYY-MM-DD |
| `{{LAST_DATE}}` | `metadata.lastDate` | YYYY-MM-DD |

> **Zero-transaction dates:** When there are no transactions, the script outputs
> `firstDate` and `lastDate` as the first day of the month. In this case, use
> the full month range instead (first day to last day) for the Notes section,
> e.g., "2026-01-01 to 2026-01-31".

### Compound Placeholders

These represent multiple rows. Generate them by iterating over JSON arrays:

**`{{CATEGORY_ROWS}}`** — One row per entry in `categoryBreakdown`:
```
| {name} | {total} {currency} | {percentage}% | {count} |
```
Sort by total descending (already sorted in the JSON).

**`{{TOP_EXPENSES_ROWS}}`** — One row per entry in `topExpenses`:
```
| {rank} | {date} | {description} | {category} | {amount} {currency} |
```

**`{{DAILY_CHART}}`** — A text-based horizontal bar chart. For each day in
`dailySpending`, render a row:
```
Day DD | {bar of blocks} {amount} {currency}
```
Scale the bars so the highest day gets ~40 block characters (`█`).
Right-align the amount values so they form a neat column.
Only include days that have expenses (skip days with zero spending).

> **WHY a template with placeholders?** Templates make the output format explicit
> and reviewable. Students can customize the report layout by editing the template
> file without modifying any code. The `{{PLACEHOLDER}}` syntax is widely recognized
> (similar to Mustache/Handlebars) and easy to search-replace.

---

## Step 3: Write the Report

1. Create the `reports/` directory at the project root if it doesn't exist:
   ```bash
   mkdir -p reports
   ```

2. Write the filled template to:
   ```
   reports/expenses-YYYY-MM.md
   ```
   For example: `reports/expenses-2026-01.md`

3. Confirm to the user that the report was generated and show the file path.

> **WHY the reports/ directory?** Keeping generated reports in a dedicated directory
> avoids cluttering the project root. The `reports/` directory is in `.gitignore`
> since reports are personal artifacts, not source code.

---

## Example

See a complete example report in:
```
.claude/skills/expenses-summary/examples/sample-report.md
```

This shows the expected output for January 2026, including the summary table,
category breakdown, top 5 expenses, and daily spending chart.
