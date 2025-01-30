export function formatCurrency(value: number, currency: "Ar" | "$"): string {
    const formattedValue = value
        .toFixed(2) // Ensure two decimal places
        .replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Add spaces as thousand separators
    return currency === "Ar" ? `${formattedValue} Ar` : `${formattedValue} $`;
}