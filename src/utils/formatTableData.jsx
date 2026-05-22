export function formatTableData(data, excludedKeys = []) {
    if (!data.length) {
        return {
            headers: [],
            records: [],
        };
    }

    const headers = Object.keys(data[0])
        .filter((key) => !excludedKeys.includes(key))
        .map((key) => ({
            key,
            label: key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
        }));

    const records = data.map((record) =>
        Object.fromEntries(
            Object.entries(record).filter(
                ([key]) => !excludedKeys.includes(key)
            )
        )
    );

    return {
        head:headers,
        rec:records,
    };
}