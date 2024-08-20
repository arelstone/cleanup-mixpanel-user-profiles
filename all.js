const { resolve } = require('path');
const csv = require('csvtojson');
const chunk = require('lodash.chunk');
const { writeFileSync } = require('fs');

const $token = process.env.MIXPANEL_TOKEN
const FILENAME = process.argv.slice(2);
const $unset = [
    "$email", "Email", "email",
    "Name", "$name", 'name',
    "customerId", 'Customer Id', 'Customer ID',
    'departmentName', 'Department ID', 'Department Id',
    'departmentName', 'Department Name',
    'departmentOfGroup', 'Department Group',
    'groupId', 'Group ID', 'Group Id',
    'enterpriseId', 'Enterprise ID', 'Enterprise Id',
]

const main = async () => {
    if (!$token) {
        throw new Error('Please provide a token. Use the MIXPANEL_TOKEN environment variable')
    }
    if (!FILENAME) {
        throw new Error('Please provide a filename')
    }

    const parsed = await csv().fromFile(resolve(__dirname, FILENAME))
    chunk(parsed, 500)
        .map(chunk => chunk.map(({ $distinct_id }) => {
            return { $distinct_id, $token, $unset }
        })
        ).map((obj, index) => writeFileSync(resolve(__dirname, '__generated__', `${index}.json`), JSON.stringify(obj)))
    return
}


main().catch(err => {
    console.error(err)
    process.exit(1)
})
