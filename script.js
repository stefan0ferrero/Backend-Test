// FileSystem
const fs = require('fs');
// CSV Parser
const csv = require('csv-parser');

// Reading CSV e processing data
function processCSV(filePath) {
    let maxTotalAmount = 0;
    let maxQuantity = 0;
    let maxDiscountDifference = 0;
    let recordWithMaxTotalAmount = null;
    let recordWithMaxQuantity = null;
    let recordWithMaxDiscountDifference = null;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Reading needed values in row
            const quantity = parseInt(row['Quantity']);
            const unitPrice = parseFloat(row['Unit price']);
            const discountPercentage = parseFloat(row['Percentage discount']);
            // Calculating needed values in row
            const totalAmountWithoutDiscount = quantity * unitPrice;
            const totalAmountWithDiscount = totalAmountWithoutDiscount * (1 - discountPercentage / 100);

            // Analyzing row values and memorizing it if necessary
            if (totalAmountWithDiscount > maxTotalAmount) {
                maxTotalAmount = totalAmountWithDiscount;
                recordWithMaxTotalAmount = row;
            }

            if (quantity > maxQuantity) {
                maxQuantity = quantity;
                recordWithMaxQuantity = row;
            }

            const discountDifference = totalAmountWithoutDiscount - totalAmountWithDiscount;
            if (discountDifference > maxDiscountDifference) {
                maxDiscountDifference = discountDifference;
                recordWithMaxDiscountDifference = row;
            }
        })
        .on('end', () => {
            // Results output using template literals
            console.log(`Highest total amount record (${maxTotalAmount}):`, recordWithMaxTotalAmount);
            console.log(`Highest quantity record (${maxQuantity}):`, recordWithMaxQuantity);
            console.log(`Highest difference between total without discount and total with discount record (${maxDiscountDifference}):`, recordWithMaxDiscountDifference);
        });
}

// Usage: pass the path to the CSV file as a command-line argument
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Usage: node script.js <path_to_csv_file>');
    process.exit(1);
}

const filePath = args[0];
processCSV(filePath);
