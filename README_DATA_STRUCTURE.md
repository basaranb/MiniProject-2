# Data Structure Documentation

## How to Extend the Application

This document explains how to add more routes or modify mobility options without changing the application logic.

## Data Model Location

All data is defined in `script.js` at the top of the file in the `routes` array (starting around line 4).

## Adding a New Route

To add a new route, simply add a new object to the `routes` array:

```javascript
const routes = [
    {
        id: 'route1',
        name: 'City Center to University',
        options: [...]
    },
    // Add your new route here:
    {
        id: 'route2',
        name: 'Airport to Downtown',
        options: [...]
    }
];
```

## Mobility Option Structure

Each mobility option must include all 6 attributes:

```javascript
{
    id: 'unique_id',           // Unique identifier (e.g., 'bike', 'car')
    name: 'Display Name',      // Name shown to user (e.g., 'Bike', 'E-Bike')
    time: 40,                  // Travel time in minutes (number)
    cost: 0,                   // Cost in euros (number, e.g., 2.50)
    co2: 0,                    // CO₂ emissions in grams (number)
    transfers: 0,              // Number of transfers (number)
    comfort: 2,                // Comfort level, scale 1-5 (number)
    physicalActivity: 5        // Physical activity level, scale 1-5 (number)
}
```

## Example: Adding a New Mobility Option

To add "Electric Car" to route1:

```javascript
{
    id: 'electric_car',
    name: 'Electric Car',
    time: 22,
    cost: 4.50,
    co2: 40,
    transfers: 0,
    comfort: 5,
    physicalActivity: 1
}
```

## Priority System

The application supports 4 priorities defined in the `priorities` object:

- `time`: Travel Time
- `co2`: CO₂ Emissions
- `cost`: Cost
- `transfers`: Number of Transfers

Each priority maps to an attribute in the mobility options.

## Important Notes

1. **All attributes are required** - Every mobility option must include all 6 attributes
2. **Numeric values only** - All attributes except `id` and `name` must be numbers
3. **Consistent units** - Keep units consistent (minutes, euros, grams)
4. **Unique IDs** - Each option must have a unique `id` within its route
5. **The application automatically adapts** - No code changes needed when adding/removing options

## Testing Your Changes

After modifying the data:

1. Open `index.html` in a web browser
2. Click "Start Experiment"
3. Select a priority
4. Verify that your new options appear correctly
5. Check that the limited information shows only the selected priority
6. Verify the full information shows all 6 attributes
