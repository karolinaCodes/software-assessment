const args = process.argv.slice(2);
const csv = require('csv-parser');
const fs = require('fs');

// fs.createReadStream(args[0])
//   .pipe(csv())
//   .on('data', row => {
//     console.log(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });
